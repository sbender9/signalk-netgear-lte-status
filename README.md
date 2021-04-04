# signalk-netgear-lte-status
SignalK Node Server Plugin that gets status from a netgear (3G/4G) lte-modem

This should work with the following devices devices,  tested with a LB1120 & confirmed also on a LB2120.
* [LB1120](https://www.netgear.com/home/products/mobile-broadband/lte-modems/LB1120.aspx)
* [LB2120](https://www.netgear.com/home/products/mobile-broadband/lte-modems/LB2120.aspx)
* [MR1100 (Nighthawk M1)](https://www.netgear.com/support/product/MR1100.aspx)
* [AirCard 800S (Optus)](https://www.netgear.com/support/product/AC800S_Optus.aspx)

It generates the following paths:

* networking.lte.usage
* networking.lte.connectionText
* networking.lte.connectionType
* networking.lte.radioQuality
* networking.lte.bars
* networking.lte.rxLevel
* networking.lte.txLevel
* networking.lte.curBand
* networking.lte.cellId
* networking.lte.registerNetworkDisplay
* networking.lte.lastMessage
* networking.lte.lastMessageTime
* 
* networking.lte.rssi
* networking.lte.ecio
* networking.lte.sinr
* networking.lte.rsrp
* networking.lte.rsrq
* networking.lte.rscp
