import {Component, OnInit} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';

import {RouteComponent} from './bus/route.component';
import {MapComponent} from './map/map.component';
import * as Rx from 'rxjs/Rx';
import 'rxjs/add/operator/pluck';




@Component({
  selector: `app`,
  template: `
    <map [routeInfoStream]="routeInfoStream"></map>

    <route (routeChange)="onRouteChange($event)"></route>
  `,
  directives: [RouteComponent, MapComponent],
  inputs: ['routeChange']
})
export class App implements OnInit {
  // take path coords emitted by route component and pass it to map
  public routeInfoStream: any;
  constructor() {}

  public ngOnInit() { }

  public onRouteChange(routeInfo) {
    this.routeInfoStream = routeInfo;
    console.log('transferring route info...');
  }
}
