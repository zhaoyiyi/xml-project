# Real Time TTC Bus Locations
##[Go to project](https://yizhao.me/work/ttc/)

API: [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/)

XML files used:
- Route List: http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc
- Route Details(501 streetcar): http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=501
- Bus Prediction(Humber Bus Terminal): http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId=15246
- Real time bus location(501 as example): http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=ttc&r=501&t=1

Other data files used:
- [TTC stop locations(Original txt)](src/stops.txt)
- [TTC stop locations(JSON)](src/stops.json)
