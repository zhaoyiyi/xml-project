import {Component, OnInit, EventEmitter} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from "ng2-material/all";
import {HTTP_PROVIDERS} from 'angular2/http';
import {Control} from 'angular2/common';
import 'rxjs/add/operator/combineLatest';


import {RouteService} from './route.service';


@Component({
  selector: 'route',
  template: `
    <md-card>
      <md-card-title>
        <md-card-title-text>
          <span class="md-headline">Route List</span>
        </md-card-title-text>
      </md-card-title>
      <md-card-content>
        <select [ngFormControl]="routeControl">
          <option *ngFor="#route of routes" [value]="route.tag">{{route.title}}</option>
        </select>
      </md-card-content>
    </md-card>
  `,
  outputs: ['routeChange', 'locationChange'],
  directive: [MATERIAL_DIRECTIVES],
  providers: [HTTP_PROVIDERS, RouteService]
})
export class RouteComponent implements OnInit {
  public routes: any;
  public routeControl: Control = new Control('');
  public routeChange = new EventEmitter();
  public locationChange = new EventEmitter();
  constructor(private _routeService: RouteService) {
    // output route coords and bus locations
    this.routeControl.valueChanges.subscribe(
      routeNum => {
        console.log('selected route: ', routeNum);
        console.log('emitting route info...');
        this.routeChange.emit( this._routeService.getRoute(routeNum) );
        console.log('emitting bus locations...');
        this.locationChange.emit( this._routeService.getBusLocations(routeNum));
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
