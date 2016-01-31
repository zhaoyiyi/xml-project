import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import * as Rx from 'rxjs/Rx';
import {Observable, Subscription} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import jquery from 'jquery';


const URL: string = `http://webservices.nextbus.com/service/publicXMLFeed?a=ttc`;

@Injectable()
export class RouteService{
  constructor(private _http: Http){}

  getBusLocations(num): Observable<any>{
    // TODO:10 change `t`
    return this.query('vehicleLocations', `r=${num}`, `t=2`).map( res =>
      this.attrArray(res, 'vehicle').map( bus => {
        return {
          id: +bus.getAttribute('id'),
          routeTag: bus.getAttribute('routeTag'),
          dirTag: bus.getAttribute('dirTag'),
          lat: +bus.getAttribute('lat'),
          lng: +bus.getAttribute('lon'),
          heading: +bus.getAttribute('heading')
        }
      })
    );
  }
  // 1. map observable returned by query
  // 2. get all nodes called `route`
  // 3. map each and return an Object with tag and title
  getRouteList(): Observable<any>{
    return this.query('routeList').map(routes =>
      this.attrArray(routes, 'route').map(route => {
        return {
          tag: route.getAttribute('tag'),
          title: route.getAttribute('title')
        };
      })
    );
  }
  getRoute(num): Observable<any>{
    return this.query( 'routeConfig', `r=${num}`).map( routes => {
      let coords = this.attrArray(routes, 'path').map( path =>
        this.attrArray(path, 'point').map ( point => {
          return {
            lat: +point.getAttribute('lat'),
            lng: +point.getAttribute('lon')
          };
        })
      )
      return {id: num, coords: coords}
    })
  }


  attrArray(xmlObj, attrName){
    let xmlNodes = xmlObj.querySelectorAll(attrName);
    return jQuery.makeArray(xmlNodes);
  }
  query(cmd: string, ...options: string[]): Observable<any>{
    return this._http.get( `${URL}&command=${cmd}&` + options.join('&') )
      .map( res => jQuery.parseXML( res.text() ) );
  }
}
