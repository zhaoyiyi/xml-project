System.register(['angular2/core', './map.service', 'rxjs/add/operator/distinctUntilChanged', 'rxjs/add/operator/repeat', 'rxjs/add/operator/debounceTime', 'rxjs/add/operator/delay', 'rxjs/add/operator/switchMap', 'rxjs/add/operator/mergeMap', 'rxjs/add/observable/interval'], function(exports_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, map_service_1;
    var MapComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (map_service_1_1) {
                map_service_1 = map_service_1_1;
            },
            function (_1) {},
            function (_2) {},
            function (_3) {},
            function (_4) {},
            function (_5) {},
            function (_6) {},
            function (_7) {}],
        execute: function() {
            MapComponent = (function () {
                function MapComponent(_mapService) {
                    this._mapService = _mapService;
                    this.mapName = '#map';
                }
                MapComponent.prototype.ngOnInit = function () {
                    this._mapService.loadMap('#map');
                };
                MapComponent.prototype.ngOnChanges = function () {
                    if (this._mapService.isInitialized) {
                        this.updateRoute();
                    }
                    if (this.busLocationsStream) {
                        this.drawBuses();
                    }
                };
                MapComponent.prototype.updateRoute = function () {
                    var _this = this;
                    this.routeInfoStream.
                        distinctUntilChanged(function (a, b) { return a.id === b.id; })
                        .subscribe(function (data) { return _this._mapService.drawPath(data.coords); });
                };
                MapComponent.prototype.drawBuses = function () {
                    var _this = this;
                    if (this.busLocations)
                        this.busLocations.unsubscribe();
                    this.busLocations = this.busLocationsStream.subscribe(function (data) {
                        _this._mapService.setMarker(data);
                    }, function (err) { return console.log(err); }, function () { return _this.updateBusLocation(); });
                };
                MapComponent.prototype.updateBusLocation = function () {
                    var _this = this;
                    this.busLocations = this.busLocationsStream
                        .delay(10000)
                        .repeat()
                        .subscribe(function (data) { return _this._mapService.updateMarker(data); }, function (err) { return console.log(err); }, function () { return console.log('update location finished.'); });
                };
                MapComponent = __decorate([
                    core_1.Component({
                        selector: 'map',
                        template: "\n    <div id=\"map\"></div>\n  ",
                        providers: [map_service_1.MapService],
                        inputs: ['routeInfoStream', 'busLocationsStream']
                    }), 
                    __metadata('design:paramtypes', [map_service_1.MapService])
                ], MapComponent);
                return MapComponent;
            }());
            exports_1("MapComponent", MapComponent);
        }
    }
});
//# sourceMappingURL=map.component.js.map