import { Component } from 'angular2/core';
import { RouteComponent } from './bus/route.component';
import { StopsComponent } from './stops/stops.component.ts';
import { MapComponent } from './map/map.component';
import { MapService } from './map/map.service';
import { RouteService } from './bus/route.service';
import { HTTP_PROVIDERS } from 'angular2/http';
import { MATERIAL_DIRECTIVES, Media, SidenavService } from "ng2-material/all";
import 'rxjs/add/operator/pluck';

@Component({
  selector: `app`,
  template: `
    <div layout="column">
      <md-sidenav-container layout="row" flex style="padding-left: 450px;">
        <md-sidenav name="left" align="left" layout="column" [style]="'side'" style="width: 450px; max-width: 500px;"  layout-padding>
          <md-toolbar class="md-theme-indigo">
            <h1 class="md-toolbar-tools">Real time TTC</h1>
          </md-toolbar>
          <md-content style="overflow-y: auto" layout-padding flex>
            <div layout="column" layout-fill layout-align="center">
              <route (routeChange)="onRouteChange($event)">
              </route>
              <stops (routeChange)="onRouteChange($event)">
              </stops>
            </div>
          </md-content>
        </md-sidenav>
        <md-content flex>
          <div layout="column" layout-fill layout-align="top center">
            <map [routeInfoStream]="routeInfoStream" [locationStream]="locationStream" [testStream]="testStream"></map>
          </div>
        </md-content>
      </md-sidenav-container>
    </div>
    
  `,
  providers: [SidenavService, MapService, RouteService, HTTP_PROVIDERS],
  directives: [RouteComponent, MapComponent, StopsComponent, MATERIAL_DIRECTIVES],
  inputs: ['routeChange']
})
export class App {
  // take path coords emitted by route component and pass it to map component
  public routeInfoStream:any;
  public locationStream:any;

  constructor(private _sidenavService:SidenavService,
              private _routeService:RouteService) {
    // _sidenavService.show('left');
  }

  public onRouteChange(routeNum) {
    this.routeInfoStream = this._routeService.getRoute(routeNum);
    this.locationStream = this._routeService.getBusLocations(routeNum);
    console.log('sending route info...');
  }

}
