import {Component, OnInit} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';

import {RouteComponent} from './bus/route.component';
import {MapComponent} from './map/map.component';
import * as Rx from 'rxjs/Rx';
import 'rxjs/add/operator/pluck';




@Component({
  selector: `app`,
  template: `
    <map [routeInfoStream]="routeInfoStream" [locationStream]="locationStream" [testStream]="testStream"></map>

    <route (routeChange)="onRouteChange($event)"
      (locationChange)="onLocationChange($event)"
      (testChange)="onTestChange($event)"></route>
  `,
  directives: [RouteComponent, MapComponent],
  inputs: ['routeChange', 'locationChange']
})
export class App implements OnInit {
  // take path coords emitted by route component and pass it to map component
  public routeInfoStream: any;
  public locationStream: any;
  public testStream: any;
  constructor() {}

  public ngOnInit() { }

  public onRouteChange(routeInfo) {
    this.routeInfoStream = routeInfo;
    console.log('transferring route info...');
  }
  public onLocationChange(busLocations) {
    this.locationStream = busLocations;
    console.log('transferring bus locations...');
  }
  public onTestChange(testChanges) {
    this.testStream = testChanges;
    console.log('>>transferring test stream...');
  }
}
