import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';


// const URL = `http://webservices.nextbus.com/service/publicXMLFeed?a=ttc`;
const URL = `https://yizhao.me/work/ttc/server/route.php?a=ttc`;

@Injectable()
export class RouteService {

  constructor(private _http: Http) {}

  // Get bus locations
  public getBusLocations(num): Observable<any> {
    return this.query('vehicleLocations', `r=${num}`, `t=0`).map( res =>
      this.attrArray(res, 'vehicle').map( bus => {
        // only return predictable buses
        if ( true || bus.getAttribute('predictable') === 'true') {
          return {
            id: +bus.getAttribute('id'),
            routeTag: bus.getAttribute('routeTag'),
            dirTag: bus.getAttribute('dirTag'),
            lat: +bus.getAttribute('lat'),
            lng: +bus.getAttribute('lon'),
            heading: +bus.getAttribute('heading')
          };
        }
      }).filter( bus => Boolean(bus))
    );
  }
  // 1. map observable returned by query
  // 2. get all nodes called `route`
  // 3. map each and return an Object with tag and title
  public getRouteList(): Observable {
    return this.query('routeList').map(routes =>
      this.attrArray(routes, 'route').map(route => {
        return {
          tag: route.getAttribute('tag'),
          title: route.getAttribute('title')
        };
      })
    );
  }

  // Get coords for all stops of one bus route
  public getRoute(num): Observable {
    return this.query( 'routeConfig', `r=${num}`).map( routes => {
      let coords = this.attrArray(routes, 'path').map( path =>
        this.attrArray(path, 'point').map ( point => {
          return {
            lat: +point.getAttribute('lat'),
            lng: +point.getAttribute('lon')
          };
        })
      );
      let stops = this.attrArray(routes, 'stop').map( stop => {
        if (stop.hasAttribute('title')) {
          return {
            title: stop.getAttribute('title'),
            lat: +stop.getAttribute('lat'),
            lng: +stop.getAttribute('lon')
          };
        }
      }).filter( stop => Boolean(stop) );

      return {
        id: num,
        coords: coords,
        stops: stops
      };
    });
  }

  // Convenient function to parse xml to arrays
  private attrArray(xmlObj, attrName) {
    let xmlNodes = xmlObj.querySelectorAll(attrName);
    return jQuery.makeArray(xmlNodes);
  }

  // Make request to api
  private query(cmd: string, ...options: string[]): Observable<any> {
    return this._http.get( `${URL}&command=${cmd}&` + options.join('&') )
      .map( res => jQuery.parseXML( res.text() ) );
  }
}
