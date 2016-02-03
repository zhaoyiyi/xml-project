import {Component, OnInit, OnChanges} from 'angular2/core';
import {MapService} from './map.service';


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
  `,
  providers: [MapService],
  inputs: ['routeInfoStream', 'locationStream', 'testStream']
})
export class MapComponent implements OnInit, OnChanges {

  public routeInfoStream: Observable<any>;
  public locationStream: Observable<any>;
  public testStream: Observable<any>;
  public busLocations: Subscription;

  constructor(private _mapService: MapService) { }

  public ngOnInit() {
    this._mapService.loadMap('#map');
  }
  public ngOnChanges() {
    if (this._mapService.isInitialized) {
      this.updateRoute();
    }
    if ( this.locationStream ) {
      this.initBuses();
    }
    if ( this.testStream ) {
      // this.test();
    }
  }

  public test() {
    this.testStream.subscribe(data => {
      this._mapService.testDrawPath(data);
    });
  }

  public updateRoute() {
    this.routeInfoStream
      .distinctUntilChanged( (a, b) => a.id === b.id )
      .subscribe(
        data => {
          console.log('drawing path');
          this._mapService.drawPath(data.coords);
          this._mapService.drawStops(data.stops);
        }
      );
  }

  public initBuses() {
    // unsubscribe the old stream before subscribe the new one
    if (this.busLocations) this.busLocations.unsubscribe();

    this.busLocations = this.locationStream
      .subscribe(
        data => {
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
