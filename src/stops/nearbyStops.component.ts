import {Component, OnInit} from 'angular2/core';
import {NoEmptyArrayPipe} from './noEmptyArray.pipe.ts';
import {PredictionPipe} from './prediction.pipe.ts';
import {StopService} from "./stop.service.ts";
import {MapService} from "../map/map.service.ts";

@Component({
  selector: 'nearby-stops',
  template: `
     <p>Current location:{{currentLocation | json}} </p>
     <button (click)="showNearbyStops()">show stops</button>
     <ul *ngIf="routes">
      <li *ngFor="#route of routes">
        <p>{{route.title}}</p>
        <ul>
          <li *ngFor="#stop of route.stops">
            {{stop.stopTitle}}
            <p  *ngFor="#predictions of stop.dir | noEmptyArray">
              {{predictions.title}} in <span style="color: crimson">{{predictions.prediction | prediction}}</span> min
            </p>
          </li>
        </ul>
      </li>
    </ul>
  `,
  providers: [StopService, MapService],
  pipes: [PredictionPipe, NoEmptyArrayPipe]
})
export class NearbyStopsComponent implements OnInit{
  routes: Array;
  currentLocation: Object;
  constructor(
      private _stopService: StopService,
      private _mapService: MapService
  ) {  }

  ngOnInit() {
    this._mapService.currentLocation.subscribe(data => {
      this.currentLocation = data;
    });
  }
  // Click button, then ask for prediction and draw stops
  public showNearbyStops() {
    this._stopService.findStops(this.currentLocation)
        .subscribe(data => {
              this.getPrediction(data);
              this._mapService.drawStops(data);
            },
            err => console.log(err)
        );
  }

  public getPrediction(stops:Array) {
    this.routes = [];
    this._stopService.getPrediction(stops)
        .subscribe(d => {
          d.toArray().map(s => {
                return {title: s[0].routeTitle, stops: s};
              })
              .subscribe(data => this.routes.push(data));
        });
  }
}