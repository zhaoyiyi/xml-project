import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import jquery from 'jquery';


const URL: string = `http://webservices.nextbus.com/service/publicXMLFeed?a=ttc`;

@Injectable()
export class RouteService{
  constructor(private _http: Http){}

  getBusLocations(num){
    // TODO: change `t`
    return this.query('vehicleLocations', `r=${num}`, `t=2`).map( res => {
      let buses = jQuery.parseXML( res.text() ).querySelectorAll('vehicle');
      return jQuery.makeArray(buses).map(bus => {
        return {
          id: +bus.getAttribute('id'),
          routeTag: bus.getAttribute('routeTag'),
          dirTag: bus.getAttribute('dirTag'),
          lat: +bus.getAttribute('lat'),
          lng: +bus.getAttribute('lon'),
          heading: +bus.getAttribute('heading')
        }
      })
    });
  }

  getRouteList(){
    return this.query('routeList')
      .map( res => {
        // 1. get response text
        // 2. use jQuery parse to XML
        // 3. return value of node `title` and `tag`
        let routes = jQuery.parseXML( res.text() ).querySelectorAll('route');
        return jQuery.makeArray(routes).map( route => {
          return {
            tag: route.getAttribute('tag'),
            title: route.getAttribute('title')
          }
        })
      })
  }
  // TODO: need refactor
  // 1. parseXML
  // 2. select 'tag name'
  // 3. make array
  // 4. map result and start 2 if needed
  // 5. return obj with getAttribute('attr')

  getAttr(XMLObj, tagNames){
    // tag name has child?
    // no, return attrs, yes,
    let i = 0;
    let tag = XMLObj.querySelectorAll( tagNames[i] );
  }

  getRoute(num){
    return this.query( 'routeConfig', `r=${num}`)
      .map( res => {
        let paths = jQuery.parseXML( res.text() ).querySelectorAll('path');
        let coords = jQuery.makeArray(paths).map( path => {
          return jQuery.makeArray( path.querySelectorAll('point') ).map( point => {
            return {
              // call it lng so it can be directly used in google map,
              // and make sure it's a number
              lat: +point.getAttribute('lat'),
              lng: +point.getAttribute('lon')
            }
          } )
        })

        return {id: num, coords: coords}
      })
  }


  query(cmd: string, ...options: string[]){
    return this._http.get( `${URL}&command=${cmd}&` + options.join('&') );
  }
}
