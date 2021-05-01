# signalk-netgear-lte-status
SignalK Node Server Plugin that gets status from a netgear (3G/4G) lte-modem

This should work with the following devices devices,  tested with a LB1120 & also confirmed on a LB2120.
* [LB1120](https://www.netgear.com/home/products/mobile-broadband/lte-modems/LB1120.aspx)
* [LB2120](https://www.netgear.com/home/products/mobile-broadband/lte-modems/LB2120.aspx)
* [MR1100 (Nighthawk M1)](https://www.netgear.com/support/product/MR1100.aspx)
* [AirCard 800S (Optus)](https://www.netgear.com/support/product/AC800S_Optus.aspx)

It generates the following paths:

* networking.lte.usage
* networking.lte.connectionText             "4G" or "3G" ("wireline"?)
* networking.lte.connectionType              IPV4 or IPv6 etc
* networking.lte.radioQuality                0 to 1.0 (eg 4 bars = 0.8)
* networking.lte.bars                        0 to 5
* networking.lte.rxLevel                     dBm Rx level, in 4G mode same as RSRP
* networking.lte.txLevel                     transmit power (dBm) 
* networking.lte.curBand                     mode and band (eg "LTE B7")
* networking.lte.cellId                     ID code of serving cell 
* networking.lte.registerNetworkDisplay     mobile service provider name
* networking.lte.lastMessage                text of last SMS received 
* networking.lte.lastMessageTime            time of last SMS
* 
Detailed signal strength / quality measures
* networking.lte.rssi                   4G or 3G recieved signal strength
* networking.lte.ecio                   3G mode only (signal quality measur)
* networking.lte.sinr                       
* networking.lte.rsrp                   4G mode only (signal strength related to quality)
* networking.lte.rsrq                   4G mode only (signal quality measure)
* networking.lte.rscp                   3G mode only (measure of signal strength el)
