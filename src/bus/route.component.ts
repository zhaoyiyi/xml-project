import {Component, OnInit, EventEmitter} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Control} from 'angular2/common';

import {RouteService} from './route.service';


@Component({
  selector: 'route',
  template: `
    <h2>Route List</h2>
    <select [ngFormControl]="routeControl">
      <option *ngFor="#route of routes" [value]="route.tag">{{route.title}}</option>
    </select>
  `,
  providers: [HTTP_PROVIDERS, RouteService],
  outputs: ['routeChange', 'locationChange']
})
export class RouteComponent implements OnInit{
  routes: any;
  routeControl: Control = new Control('');
  routeChange = new EventEmitter();
  locationChange = new EventEmitter();
  autoUpdate: any;

  constructor(private _routeService: RouteService){
    // output route coords and bus locations
    this.routeControl.valueChanges.subscribe(
      routeNum => {
        console.log('selected route: ', routeNum);
        this.emitRouteInfo(routeNum); // emit route observable
        this.emitBusLocations(routeNum);
      },
      err => console.log( 'err in route component when emitting',err )
    )
  }

  ngOnInit(){
    this.getRouteList();

  }

  getRouteList(){
    this._routeService.getRouteList()
      .subscribe(
          data => this.routes = data,
          err => console.log(err),
          () => console.log('finish loading route list')
        );
  }

  // return observable
  emitRouteInfo(routeNum){
    console.log('emitting route info...')
    this.routeChange.emit( this._routeService.getRoute(routeNum) )
    /*this._routeService.getRoute(routeNum)
      .subscribe(
        data => this.routeChange.emit( data )
      )*/

  }
  getBuses(routeNum){
    return this._routeService.getBusLocations(routeNum);
  }

  emitBusLocations(routeNum){
    /*if(this.autoUpdate) {
      clearInterval(this.autoUpdate);
      console.log('route component clear interval')
    }
    this.locationChange.emit( this.getBuses(routeNum) );
    this.autoUpdate = setInterval( () => {
      console.log('emitting bus locations stream');
      this.locationChange.emit( this.getBuses(routeNum) );
    }, 10000)*/

    this.locationChange.emit( this.getBuses(routeNum) );

  }
}
