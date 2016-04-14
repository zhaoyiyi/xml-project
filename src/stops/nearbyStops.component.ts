import {Component, OnInit} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from "ng2-material/all";
import {NoEmptyArrayPipe} from './noEmptyArray.pipe.ts';
import {PredictionPipe} from './prediction.pipe.ts';
import {StopService} from "./stop.service.ts";
import {MapService} from "../map/map.service.ts";
import {StopPrediction} from '../interface';
import {Observable, GroupedObservable} from "rxjs/Observable";

@Component({
  selector: 'nearby-stops',
  template: `
     <p>Current location:{{currentLocation | json}} </p>
     <button md-raised-button class="md-raised"
      (click)="showNearbyStops()">show stops</button>
      
      <md-content class="md-padding" *ngIf="routes">
        <md-tabs md-dynamic-height md-border-bottom>
          <template md-tab *ngFor="#route of routes" [label]="route.title" >
            <md-list class="md-3-line">
              <md-list-item *ngFor="#stop of route.stops">
                <div class="md-list-item-text">
                  <h3>{{stop.stopTitle}}</h3>
                  <p  *ngFor="#predictions of stop.dir | noEmptyArray">
                    {{predictions.title}} in <span style="color: crimson">{{predictions.prediction | prediction}}</span> min
                  </p>
                </div>
              </md-list-item>
            </md-list>
          </template>
        </md-tabs>
      </md-content>
  `,
  directives: [MATERIAL_DIRECTIVES],
  providers: [StopService, MapService],
  pipes: [PredictionPipe, NoEmptyArrayPipe]
})
export class NearbyStopsComponent implements OnInit {
  routes:Array;
  currentLocation:Object;

  constructor(private _stopService:StopService,
              private _mapService:MapService) {
  }

  ngOnInit() {
    this._mapService.currentLocation.subscribe(data => {
      this.currentLocation = data;
    });
  }

  // Click button, then ask for prediction and draw stops
  showNearbyStops() {
    this._mapService.setMap();
    this._stopService.findStops(this.currentLocation)
        .subscribe(data => {
              this.getPrediction(data);
            },
            err => console.log(err)
        );
  }

  getPrediction(stops:Array) {
    this.routes = [];
    this._stopService.getPrediction(stops)
        .mergeMap(route => this._groupRoute(route))
        .toArray()
        .map( (stop: Array) => this._generateStopInfo(stop))
        .subscribe(routeArray => {
          console.log(routeArray);
        });
  }

  private _generateStopInfo(stops: Array<StopPrediction>) {
    const info =  stops.map(stop => {
      let text = `${stop.stopTitle}<br>`;
      if (stop.dir.length > 0) {
        text += `${stop.dir[0].title}<br>`;
        if (stop.dir[0].prediction.length > 0) text += `${stop.dir[0].prediction[0].min}min`
      }
      return text;
    });
    this._mapService.drawStops(stops, info);
    return stops;
  }

  private _groupRoute(route: GroupedObservable<StopPrediction>) {
    route.toArray().map( (r: Array) => {
      this.routes.push({title: r[0].routeTitle, stops: r})
    }).subscribe();
    return route;
  }
}