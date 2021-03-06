import { Http } from 'angular2/http';
import { Injectable } from 'angular2/core';
import { Observable, GroupedObservable } from 'rxjs/Observable';
import { xmlObservable } from './../bus/helper';
import * as Rx from 'rxjs/Rx';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { StopPrediction } from '../interface';

@Injectable()
export class StopService {
  private _radius = 0.0035;

  constructor(private _http: Http) {}

  public findStops(coord): Observable<any> {
    return this._http
      .get('src/stops/stops.json')
      .mergeMap((res) => res.json())
      .filter((stop) => {
        return (
          this.round(stop.lat, coord.lat) && this.round(stop.lng, coord.lng)
        );
      })
      .toArray();
  }

  public getPrediction(stops: Array): GroupedObservable<StopPrediction> {
    return Rx.Observable.from(stops).mergeMap((stop) => this.getStopInfo(stop));
  }

  private getStopInfo(stop): Observable<any> {
    return this._http
      .get(
        `https://xml-project.vercel.app/api/routeList?command=predictions&a=ttc&stopId=${stop.id}`
      )
      .map((res) => $.parseXML(res.text()))
      .mergeMap((res) => xmlObservable('//predictions', res))
      .mergeMap((p) => {
        return Rx.Observable.create((observer) => {
          observer.next({
            lat: stop.lat,
            lng: stop.lng,
            routeTitle: p.getAttribute('routeTitle'),
            routeTag: p.getAttribute('routeTag'),
            stopTitle: p.getAttribute('stopTitle'),
            dirNoPrediction:
              p.getAttribute('dirTitleBecauseNoPredictions') || null,
            // here calls the function
            dir: this.getDirection(p),
          });
          observer.complete();
        });
      });
  }

  //
  private getDirection(predictions: HTMLElement): Array {
    let dir = $.makeArray(predictions.children);
    return dir.map((d) => {
      return {
        title: d.getAttribute('title'),
        prediction: this.getDirPrediction(d.children),
      };
    });
  }

  private getDirPrediction(prediction): Array {
    let dir = $.makeArray(prediction);
    return dir.map((p) => {
      return {
        min: p.getAttribute('minutes'),
        sec: p.getAttribute('seconds'),
        time: p.getAttribute('epochTime'),
        isDeparture: p.getAttribute('isDeparture'),
      };
    });
  }

  private round(num1, num2) {
    let a = Math.abs(num1);
    let b = Math.abs(num2);
    return Math.abs(a - b) <= this._radius;
  }
}
