import {Component, OnInit, OnChanges} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {MapService} from './map.service';
import {StopService} from '../bus/stop.service';
import {PredictionPipe} from '../bus/prediction.pipe';
import {Sort} from '../bus/sort.pipe';
import {Observable, Subscription} from 'rxjs';
import * as Rx from 'rxjs/Rx';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/pluck';


declare var google;
@Component({
  selector: 'map',
  template: `
    <div id="map"></div>
    <p>Current location:{{currentLocation | json}} </p>
    <ul *ngIf="routes">
      <li *ngFor="#route of routes">
        <p>{{route.title}}</p>
        <ul>
          <li *ngFor="#stop of route.stops">
            {{stop.stopTitle}}
            <p *ngFor="#predictions of stop.dir">
              {{predictions.title}} {{predictions.prediction | prediction}}
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <button (click)="showNearbyStops()">show stops</button>
  `,
  providers: [HTTP_PROVIDERS, MapService, StopService],
  inputs: ['routeInfoStream', 'locationStream', 'testStream'],
  pipes: [PredictionPipe]
})
export class MapComponent implements OnInit, OnChanges {
  public currentLocation: any;
  public routeInfoStream: Observable<any>;
  public locationStream: Observable<any>;
  public testStream: Observable<any>;
  public busLocations: Subscription;
  public stops: any;
  public routes: Array = [];

  constructor(
      private _mapService: MapService,
      private _stopService: StopService
  ) { }

  public ngOnInit() {
    this._mapService.loadMap('#map');
    this._mapService.currentLocation.subscribe(data => {
      this.currentLocation = data;
    });
  }
  public ngOnChanges() {
    if (this._mapService.isInitialized) {
      this.updateRoute();
    }
    if ( this.locationStream ) {
      this.initBuses();
    }
  }
  // Click button, then ask for prediction and draw stops
  public showNearbyStops() {
    this._stopService.findStops(this.currentLocation)
      .subscribe( data => {
        this.getPrediction(data);
        this._mapService.drawStops(data);
      },
        err => console.log(err)
      );
  }
  public getPrediction(stops) {
    this.stops = [];
    let info$ = Rx.Observable.fromArray(stops)
      .pluck('id')
      .mergeMap(stopId => this._stopService.getStopInfo(stopId))
      .share()
      .groupBy((info) => info.routeTag)
      .subscribe(d => {
        d.toArray().map( s => {
          return {title: s[0].routeTitle, stops: s};
        })
        .subscribe(data => this.routes.push(data));
      });
  }
  public updateRoute() {
    this.routeInfoStream
      .distinctUntilChanged( (a, b) => a.id === b.id )
      .subscribe( data => {
        console.log('drawing path');
        this._mapService.drawPath(data.coords);
        this._mapService.drawStops(data.stops);
      });
  }
  public initBuses() {
    // unsubscribe the old stream before subscribe the new one
    if (this.busLocations) this.busLocations.unsubscribe();

    this.busLocations = this.locationStream
      .subscribe( data => {
        this._mapService.drawBuses(data);
      },
      err => console.log(err),
      () => this.updateBusLocation()
    );
  }
  public updateBusLocation() {
    this.busLocations = this.locationStream
      .delay(10000)
      .repeat()
      .subscribe(
        data => this._mapService.updateMarker(data),
        err => console.log(err),
        () => console.log('update location finished.')
      );
  }
}// end
