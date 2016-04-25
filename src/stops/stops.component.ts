import { Component, OnInit, EventEmitter } from 'angular2/core';
import { MATERIAL_DIRECTIVES } from "ng2-material/all";
import { PredictionPipe } from './prediction.pipe.ts';
import { StopService } from "./stop.service.ts";
import { MapService } from "../map/map.service.ts";
import { StopPrediction } from '../interface';
import { Observable } from "rxjs/Observable";
import { HTTP_PROVIDERS } from "angular2/http";

@Component({
  selector: 'stops',
  template: `
    <md-card>
      <md-card-content>
        <button md-raised-button class="md-raised"
          (click)="showNearbyStops()">show stops</button>
        <button md-raised-button class="md-raised"
          (click)="showClosestStop()">closest stop</button>
      </md-card-content>
    </md-card>
    
    <div  *ngIf="routes">
      <md-card *ngFor="#route of routes">
        <md-card-title>
          <md-card-title-text>
            <span class="md-headline" style="cursor: pointer;"
            (click)="showRoute(route)">{{route.title}}</span>
          </md-card-title-text>
        </md-card-title>
        <md-card-content layout="column" layout-fill layout-align="center">
          <md-list class="md-3-line md-long-text">
              <md-list-item *ngFor="#stop of route.stops">
                <div class="md-list-item-text">
                  <h3 (click)="focusStop(stop.lat, stop.lng)" style="cursor: pointer;">{{stop.stopTitle}}</h3> 
                  <p  *ngFor="#predictions of stop.dir">
                    {{predictions.title}} in <span style="color: crimson">{{predictions.prediction | prediction}}</span> min
                  </p>
                </div>
              </md-list-item>
            </md-list>
        </md-card-content>
      </md-card>
    </div>
  `,
  outputs: ['routeChange'],
  directives: [MATERIAL_DIRECTIVES],
  providers: [StopService, HTTP_PROVIDERS],
  pipes: [PredictionPipe]
})
export class StopsComponent implements OnInit {
  routes: Array;
  closestStop: StopPrediction;
  public routeChange = new EventEmitter();
  currentLocation: Object = { lat: '', lng: '' };
  prediction$: Observable;

  constructor(private _stopService: StopService,
              private _mapService: MapService) {
  }

  ngOnInit() {
    this._mapService.currentLocation.subscribe(data => {
      this.currentLocation = data;
    });
  }

  // Click button, then ask for prediction and draw stops
  showNearbyStops() {
    this._getPredictionStream(() => {
      this._savePrediction(this.prediction$);
      this._drawStopInfo(this.prediction$);
    })
  }

  showClosestStop() {
    this._getPredictionStream(() => {
      this._getClosestLocation(this.prediction$, () => {
        this.routes = [{
          title: this.closestStop.routeTitle,
          stops: [this.closestStop]
        }];
        this._drawStopInfo(Observable.of(this.closestStop));
      });
    })
  }

  focusStop(lat, lng) {
    this._mapService.setMapCenter({ lat: +lat, lng: +lng });
  }

  showRoute(route) {
    document.querySelector('select').value = route.stops[0].routeTag;
    const routeTag = route.stops[0].routeTag;
    this.routeChange.emit(routeTag);
  }

  // ===== Private functions =====

  private _getPredictionStream(callback) {
    this._stopService.findStops(this.currentLocation)
        .subscribe(data => {
          this.prediction$ = this._stopService.getPrediction(data)
              .filter(stop => stop.dirNoPrediction === null)
              .share();
        }, error => console.log(error), () => callback());
  }

  private _savePrediction(predictionStream: Observable) {
    this.routes = [];
    predictionStream
        .groupBy(stop => stop.routeTitle)
        .subscribe(group => group.toArray().subscribe(stops => {
          this.routes.push({ title: stops[0].routeTitle, stops: stops })
        }));
  }

  // Add stop tooltip and draw stops on map
  private _drawStopInfo(predictionStream: Observable) {
    predictionStream.toArray()
        .subscribe(stops => {
          const info = stops.map((stop: StopPrediction) => {
            let text = `${stop.stopTitle}<br>`;
            if (stop.dir.length > 0) {
              text += stop.dir.map(direction => {
                const prediction = direction.prediction[0] ? direction.prediction[0].min : '';
                return `${direction.title} - ${prediction}min<br>`;
              }).join();
            }
            return text;
          });
          this._mapService.drawStops(stops, info);
        });
  }


  private _getClosestLocation(prediction$: Observable, onComplete = () => {
  }) {
    const loc = this.currentLocation;
    prediction$.toArray().subscribe(stops => {
      const result = stops.reduce((acc, stop) => {
        const dLat = Math.abs(+stop.lat) - Math.abs(loc.lat);
        const dLng = Math.abs(+stop.lng) - Math.abs(loc.lng);
        const distance = Math.sqrt(dLat * dLat + dLng * dLng);
        return acc.diff > distance ? { diff: distance, stop } : acc;
      }, { diff: 1, stop: {} });
      this.closestStop = result.stop;
    }, err => console.log(err), () => onComplete());
  }
}