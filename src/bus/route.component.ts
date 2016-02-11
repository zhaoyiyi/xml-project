import {Component, OnInit, EventEmitter} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Control} from 'angular2/common';
import * as Rx from 'rxjs/Rx';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/combineLatest';


import {RouteService} from './route.service';


@Component({
  selector: 'route',
  template: `
    <h2>Route List</h2>
    <select [ngFormControl]="routeControl">
      <option *ngFor="#route of routes" [value]="route.tag">{{route.title}}</option>
    </select>
  `,
  outputs: ['routeChange', 'locationChange', 'testChange'],
  providers: [HTTP_PROVIDERS, RouteService]
})
export class RouteComponent implements OnInit {
  public routes: any;
  public routeControl: Control = new Control('');
  public routeChange = new EventEmitter();
  public locationChange = new EventEmitter();
  public testChange = new EventEmitter();
  constructor(private _routeService: RouteService) {
    // output route coords and bus locations
    this.routeControl.valueChanges.subscribe(
      routeNum => {
        console.log('selected route: ', routeNum);
        console.log('emitting route info...');
        this.routeChange.emit( this._routeService.getRoute(routeNum) );
        console.log('emitting bus locations...');
        this.locationChange.emit( this._routeService.getBusLocations(routeNum));
        // test here
        console.log('>>>emitting test info');
        this.testChange.emit( this._routeService.testPath(routeNum) );
      },
      err => console.log( 'err in route component when emitting', err )
    );
  }

  public ngOnInit() {
    this.getRouteList();
  }
  public getRouteList() {
    this._routeService.getRouteList().subscribe(
      data => this.routes = data,
      err => console.log(err),
      () => console.log('finish loading route list')
    );
  }
}
