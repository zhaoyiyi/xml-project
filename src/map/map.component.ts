import { Component, OnInit, OnChanges, EventEmitter } from 'angular2/core';
import { HTTP_PROVIDERS } from 'angular2/http';
import { MapService } from './map.service';
import { Observable, Subscription } from 'rxjs';


declare var google;
@Component({
  selector: 'map',
  template: `
    <div id="map" style="width: 100%; height: 100vh;"></div>
  `,
  providers: [HTTP_PROVIDERS],
  inputs: ['routeInfoStream', 'locationStream', 'testStream'],
})
export class MapComponent implements OnInit, OnChanges {
  public routeInfoStream:Observable<any>;
  public locationStream:Observable<any>;
  public testStream:Observable<any>;
  public busLocations:Subscription;
  public stops:any;

  constructor(private _mapService:MapService) {
  }

  public ngOnInit() {
    this._mapService.loadMap('#map');
  }

  public ngOnChanges() {
    if (this._mapService.isInitialized) this.updateRoute();
    if (this.locationStream) this.initBuses();
  }

  // Draw bus route on map
  public updateRoute() {
    this.routeInfoStream
        .distinctUntilChanged((a, b) => a.id === b.id)
        .subscribe(data => {
          console.log('drawing path');
          this._mapService.drawPath(data.coords);
          this._mapService.drawStops(data.stops);
        });
  }

  public initBuses() {
    // unsubscribe the old stream before subscribe the new one
    if (this.busLocations) this.busLocations.unsubscribe();

    this.busLocations = this.locationStream
        .subscribe(data => this._mapService.drawBuses(data),
            err => console.log(err),
            () => this.updateBusLocation()
        );
  }

  // try refresh bus locations every 10 seconds
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
