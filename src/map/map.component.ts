import {Component, OnInit, OnChanges} from 'angular2/core';
import {MapService} from './map.service';
import {Observable, Subscription} from 'rxjs';
import * as Rx from 'rxjs/Rx';
// import {Operator} from 'rxjs/Operator';
import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/operator/distinctUntilKeyChanged';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/interval';

declare var google;
@Component({
  selector: 'map',
  template:`
    <div id="map"></div>
  `,
  providers: [MapService],
  inputs: ['routeInfoStream', 'busLocationsStream']
})
export class MapComponent implements OnInit, OnChanges{

  routeInfo: any;
  routeInfoStream: Observable<any>;
  busLocations: Subscription;
  busLocationsStream: Observable<any>;
  mapName: string = '#map';

  constructor(private _mapService: MapService) { }

  ngOnInit(){
    this._mapService.loadMap('#map');
  }
  ngOnChanges(){
    if(this._mapService.isInitialized){
      this.updateRoute();
    }
    if(this.busLocationsStream) {
      this.drawBuses();
    }
  }

  updateRoute(){
    this.routeInfoStream.distinctUntilChanged(
      (a, b) => {
        console.log('ab',a, b);
        return a.id === b.id;
      })
      .subscribe(data => this._mapService.drawPath(data.coords));
  }

  drawBuses(){
    // unsubscribe the old stream before subscribe the new one
    if(this.busLocations) this.busLocations.unsubscribe();

    this.busLocations = this.busLocationsStream.subscribe(
      data => {
        this._mapService.setMarker(data)
      },
      err => console.log(err),
      () => this.updateBusLocation()
    );
  }
  updateBusLocation(){
    this.busLocations = this.busLocationsStream
      .delay(10000)
      .repeat()
      .subscribe(
        data => this._mapService.updateMarker(data),
        err => console.log(err),
        () => console.log('update location finished.')
      );
  }

}// end
