import {Component, OnInit} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';


import {RouteComponent} from './bus/route.component';
import {MapComponent} from './map/map.component';
import * as Rx from 'rxjs/Rx';



@Component({
  selector: `app`,
  template: `
    <map [routeInfoStream]="routeInfoStream" [busLocationsStream]="busLocationsStream"></map>

    <route (routeChange)="onRouteChange($event)"
      (locationChange)='onLocationChange($event)'></route>
  `,
  directives: [RouteComponent, MapComponent],
  inputs: ['routeChange', 'locationChange']
})
export class App implements OnInit{
  // take path coords emitted by route component and pass it to map
  routeInfoStream: any;
  busLocationsStream:  any;
  constructor(){}

  ngOnInit(){

  }

  onRouteChange(routeInfo){
    this.routeInfoStream = routeInfo;
    console.log('transferring route info...');
  }
  onLocationChange(busLocations){
    this.busLocationsStream = busLocations;
    console.log('transferring bus locations...');
  }

}
