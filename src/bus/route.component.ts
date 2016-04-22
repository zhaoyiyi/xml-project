import { Component, OnInit, EventEmitter } from 'angular2/core';
import { MATERIAL_DIRECTIVES } from "ng2-material/all";
import { Control } from 'angular2/common';
import 'rxjs/add/operator/combineLatest';
import { RouteService } from './route.service';


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
  outputs: ['routeChange'],
  directive: [MATERIAL_DIRECTIVES]
})
export class RouteComponent implements OnInit {
  public routes:any;
  public routeControl:Control = new Control('');
  public routeChange = new EventEmitter();

  constructor(private _routeService:RouteService) {
    // Emit route number when change item in dropdown list
    this.routeControl.valueChanges.subscribe(
        routeNum => this.routeChange.emit(routeNum),
        err => console.log('err in route component when emitting', err)
    );
  }

  // Get route list when app start
  ngOnInit() {
    this.getRouteList();
  }

  getRouteList() {
    this._routeService.getRouteList().subscribe(
        data => this.routes = data,
        err => console.log(err),
        () => console.log('finish loading route list')
    );
  }

}
