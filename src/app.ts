import { Component } from 'angular2/core';
import { RouteComponent } from './bus/route.component';
import { NearbyStopsComponent } from './stops/nearbyStops.component.ts';
import { MapComponent } from './map/map.component';
import { MATERIAL_DIRECTIVES, Media, SidenavService } from "ng2-material/all";
import 'rxjs/add/operator/pluck';

@Component({
  selector: `app`,
  template: `
    <div layout="column">
      <md-sidenav-container layout="row" flex>
        <md-sidenav name="left" align="left" layout="column" [style]="'side'">
          <md-toolbar class="md-theme-indigo">
            <h1 class="md-toolbar-tools">Real time TTC</h1>
          </md-toolbar>
          <md-content style="overflow-y: auto" >
            <div layout="column" layout-fill layout-align="center">
              <route (routeChange)="onRouteChange($event)"
                (locationChange)="onLocationChange($event)"
                (testChange)="onTestChange($event)">
              </route>
              <nearby-stops></nearby-stops>
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
  providers: [SidenavService],
  directives: [RouteComponent, MapComponent, NearbyStopsComponent, MATERIAL_DIRECTIVES],
  inputs: ['routeChange', 'locationChange']
})
export class App {
  // take path coords emitted by route component and pass it to map component
  public routeInfoStream:any;
  public locationStream:any;

  constructor(private _sidenavService:SidenavService) {
    // _sidenavService.show('left');
  }

  public onRouteChange(routeInfo) {
    this.routeInfoStream = routeInfo;
    console.log('transferring route info...');
  }

  public onLocationChange(busLocations) {
    this.locationStream = busLocations;
    console.log('transferring bus locations...');
  }

}
