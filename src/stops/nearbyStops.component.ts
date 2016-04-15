import {Component, OnInit} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from "ng2-material/all";
import {NoEmptyArrayPipe} from './noEmptyArray.pipe.ts';
import {PredictionPipe} from './prediction.pipe.ts';
import {StopService} from "./stop.service.ts";
import {MapService} from "../map/map.service.ts";
import {StopPrediction} from '../interface';
import {Observable, GroupedObservable} from "rxjs/Observable";

// todo: closest, click to focus stop
@Component({
  selector: 'nearby-stops',
  template: `
    <p>Current location:{{currentLocation | json}} </p>
    <button md-raised-button class="md-raised"
      (click)="showNearbyStops()">show stops</button>
    <button md-raised-button class="md-raised"
      (click)="showClosestStop()">closest stop</button>
    <md-content class="md-padding" *ngIf="routes">
      <md-tabs md-dynamic-height md-border-bottom>
        <template md-tab *ngFor="#route of routes" [label]="route.title" >
          <md-list class="md-3-line">
            <md-list-item *ngFor="#stop of route.stops">
              <div class="md-list-item-text">
                <h3 style="display: inline">{{stop.stopTitle}}</h3> 
                <button md-raised-button class="md-mini md-primary"
                  >show on map</button>
                <p  *ngFor="#predictions of stop.dir">
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
  closestStop: StopPrediction;
  currentLocation:Object = {lat: '', lng: ''};
  prediction$: Observable;

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
    this._getPredictionStream( () => {
      this._savePrediction(this.prediction$);
      this._drawStopInfo(this.prediction$);
    })
  }

  showClosestStop() {
    this._getPredictionStream( () => {
      this._getClosestLocation(this.prediction$, () => {
        this.routes = [{
          title: this.closestStop.routeTitle,
          stops: [this.closestStop]
        }];
        this._drawStopInfo(Observable.of(this.closestStop));
      });
    })
  }

  // ===== Private functions =====

  private _getPredictionStream(callback) {
    this._mapService.setMap();
    this._stopService.findStops(this.currentLocation)
        .subscribe(data => {
          this.prediction$ = this._stopService.getPrediction(data)
              .filter(stop => stop.dirNoPrediction === null)
              .share();
        }, error => console.log(err), () => callback());
  }

  private _savePrediction(predictionStream:Observable) {
    this.routes = [];
    predictionStream
        .groupBy(stop => stop.routeTitle)
        .subscribe(group => group.toArray().subscribe(stops => {
          this.routes.push({title: stops[0].routeTitle, stops: stops})
        }));
  }

  // Add stop tooltip and draw stops on map
  private _drawStopInfo(predictionStream:Observable) {
    predictionStream.toArray()
        .subscribe(stops => {
          const info = stops.map((stop: StopPrediction) => {
            let text = `${stop.stopTitle}<br>`;
            if (stop.dir.length > 0) {
              text += stop.dir.map(direction => {
                const prediction = direction.prediction[0] ? direction.prediction[0].min : '';
                return `${direction.title} - ${prediction}min`;
              }).join();
            }
            return text;
          });
          this._mapService.drawStops(stops, info);
        });
  }


  private _getClosestLocation(prediction$: Observable, onComplete = () => {}) {
    const loc = this.currentLocation;
    prediction$.toArray().subscribe(stops => {
      const result = stops.reduce((acc, stop) => {
        const dLat = Math.abs(+stop.lat) - Math.abs(loc.lat);
        const dLng = Math.abs(+stop.lng) - Math.abs(loc.lng);
        const distance = Math.sqrt(dLat * dLat + dLng * dLng);
        return acc.diff > distance ? {diff: distance, stop} : acc;
      }, {diff: 1, stop: {}});
      this.closestStop = result.stop;
    }, err => console.log(err), () => onComplete());
  }
}