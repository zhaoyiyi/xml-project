import {Http} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {Observable} from "rxjs/Observable";
import {xmlObservable} from './helper';
import * as Rx from 'rxjs/Rx';
import jquery from 'jquery';

@Injectable()
export class StopService {

  constructor(private _http: Http) {}
  public findStops(coord): Observable<any> {
    return this._http.get('stops/stops.json')
      .mergeMap(res => res.json())
      .filter( stop => {
        return this.round(stop.lat, coord.lat) && this.round(stop.lng, coord.lng);
      })
      .toArray();
  }
  public getStopInfo(stopId): Observable<any> {
    return this._http.get(`http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&stopId=${stopId}`)
      .map(res => $.parseXML(res.text()))
      .mergeMap(res => xmlObservable('//predictions', res))
      .mergeMap( p => {
        return Rx.Observable.create( observer => {
          observer.next({
            routeTitle: p.getAttribute('routeTitle'),
            routeTag: p.getAttribute('routeTag'),
            stopTitle: p.getAttribute('stopTitle'),
            dirNoPrediction: p.getAttribute('dirTitleBecauseNoPredictions') || null,
            // here calls the function
            dir: this.getDirection(p)
          });
          observer.complete();
        });
    });
  }
  //
  private getDirection(predictions: HTMLElement): Array {
    let dir = $.makeArray(predictions.children);
    return dir.map( d => {
      return {
        title: d.getAttribute('title'),
        prediction: this.getDirPrediction(d.children)
      };
    });
  }
  private getDirPrediction(prediction): Array {
    let dir = $.makeArray(prediction);
    return dir.map( p => {
      return {
        min: p.getAttribute('minutes'),
        sec: p.getAttribute('seconds'),
        time: p.getAttribute('epochTime'),
        isDeparture: p.getAttribute('isDeparture')
      };
    });
  }
  private round(num1, num2) {
    let n = Math.pow(10, 2);
    let a = Math.abs(num1);
    let b = Math.abs(num2);
    //return Math.floor( +num1 * n ) === Math.floor( +num2 * n);
    return Math.abs( a - b ) <= 0.0025;
  }
}
