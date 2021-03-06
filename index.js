/*
 * Copyright 2019 Scott Bender <scott@scottbender.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { URLSearchParams } = require('url')
const fetch = require('node-fetch')
const _ = require('lodash')                                                     

const prefix = 'networking.lte'
const keys = {
  'wwan.IP': `ip`,
  'wwan.dataUsage.generic.dataTransferred': `usage`,
  'wwan.connectionText': 'connectionText',
  'wwan.connectionType': 'connectionType',
  'wwanadv.radioQuality': 'radioQuality',
  'wwan.signalStrength.bars': 'bars',
  'wwanadv.rxLevel': 'rxLevel',
  'wwanadv.txLevel': 'txLevel',
  'wwanadv.curBand': 'curBand',
  'wwanadv.cellId': 'cellId',
  'wwan.registerNetworkDisplay': 'registerNetworkDisplay'
}

module.exports = function(app) {
  var plugin = {};
  var interval
  var options

  plugin.start = function(props) {
    options = props
    plugin.connect()
  }

  plugin.connect = function() {
    const url = `http://${options.host}`
    fetch(`${url}/model.json`)
      .then(r => r.json())
      .then(parsed => {
        const secToken = parsed.session.secToken
        //console.log(JSON.stringify(parsed, null, 2))
        app.debug(`secToken ${secToken}`)
        const params = new URLSearchParams()
        //const params = new FormData()
        params.set('session.password', options.password)
        params.set('token', secToken)

        const configURL = parsed.general.configURL
        const cookie = configURL.split('=')[1]
        app.debug(`configURL ${configURL}`)
        app.setProviderStatus('Connected')
        fetch(`${url}${configURL}`, {
          method: 'POST',
          body: params,
          headers: {
            cookie: `sessionId=${decodeURI(cookie)}`
          },
          credentials: 'include'
        }).then( r => {
          app.debug(`status: ${r.status} ${r.statusText}`)

          if ( r.status !== 204 && r.status !== 200 ) {
            app.setProviderError(`unable to login: ${r.statusText}`)
            return
          }
          
          const cookies = r.headers.raw()['set-cookie']
          const session = cookies[0].split(';')[0]
          
          app.debug(`new session ${session}`)

          function getStatus()
          {
            fetch(`${url}/model.json`, {
              credentials: 'include',
              headers: {
                cookie: session
              }
            })
              .then(r => r.json())
              .then(parsed => {
                //app.debug(JSON.stringify(parsed, null, 2))

                let values = []
                _.keys(keys).forEach(key => {
                  let val = _.get(parsed, key)
                  if ( typeof val !== 'undefined' ) {
                    if ( key === 'wwan.dataUsage.generic.dataTransferred' ) {
                      val = val/1024/1024/1024
                    } else if ( key === 'wwanadv.radioQuality' ) {
                      val = val / 100
                    }
                    values.push({
                      "path": prefix + '.' + keys[key],
                      "value": val
                    })
                  }
                })

                if ( parsed.sms.msgs.length > 0 ) {
                  values.push({
                    path: `${prefix}.lastMessage`,
                    value: parsed.sms.msgs[0].text
                  })
                  values.push({
                    path: `${prefix}.lastMessageTime`,
                    value: parsed.sms.msgs[0].rxTime
                  })
                }

                if ( typeof parsed.wwan.signalStrength.bars !== 'undefined' ) {
                  values.push({
                    path: `${prefix}.barsRatio`,
                    value: parsed.wwan.signalStrength.bars / 5
                  })
                }
                
                app.handleMessage(plugin.id, {
                  "updates": [
                    {
                      "values": values
                    }
                  ]
                })
              })
              .catch(err => {
                const msg = `unable to get status: ${err.msg}`
                app.setProviderError(msg)
              })
          }
          app.setProviderStatus('Connected and logged In')
          getStatus()
          setInterval(getStatus, options.pollTime ? options.pollTime*1000 : 10000)
        })
          .catch(err => {
            const msg = `unable to login: ${err.message}`
            app.setProviderError(err.msg)
          })
      })
      .catch(err => {
        scheduleReconnect(err.message)
      })
  }
  
  function scheduleReconnect(errorMessage) {
    const delay = options.pollTime ? options.pollTime*1000 : 10000
    const msg = `${errorMessage} (retry delay ${(
    delay / 1000
  ).toFixed(0)} s)`
    app.error(errorMessage)
    app.setProviderError(msg)
    setTimeout(plugin.connect, delay)
  }
  
  plugin.stop = function() {
    if ( interval ) {
      clearInterval(interval)
      interval = null
    }
  }
  
  plugin.id = "signalk-netgear-lte-status"
  plugin.name = "Netgear LTE Status"
  plugin.description = "SignalK Node Server Plugin that gets status from a netgear lte-modem"

  plugin.schema = {
    type: "object",
    properties: {
      host: {
        type: 'string',
        title: 'Host/IP',
        default: 'lb1120.mhs'
      },
      password: {
        type: 'string',
        title: 'Password'
      },
      pollTime: {
        type: 'number',
        title: 'Poll Time',
        default: 10,
        description: 'In seconds'
      }
    }
  }

  return plugin;
}
