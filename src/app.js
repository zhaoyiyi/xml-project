System.register(['angular2/core', './bus/route.component', './map/map.component', 'rxjs/add/operator/pluck'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, route_component_1, map_component_1;
    var App;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (route_component_1_1) {
                route_component_1 = route_component_1_1;
            },
            function (map_component_1_1) {
                map_component_1 = map_component_1_1;
            },
            function (_1) {}],
        execute: function() {
            App = (function () {
                function App() {
                }
                App.prototype.ngOnInit = function () { };
                App.prototype.onRouteChange = function (routeInfo) {
                    this.routeInfoStream = routeInfo;
                    console.log('transferring route info...');
                };
                App.prototype.onLocationChange = function (busLocations) {
                    this.locationStream = busLocations;
                    console.log('transferring bus locations...');
                };
                App = __decorate([
                    core_1.Component({
                        selector: "app",
                        template: "\n    <map [routeInfoStream]=\"routeInfoStream\" [locationStream]=\"locationStream\"></map>\n\n    <route (routeChange)=\"onRouteChange($event)\"\n      (locationChange)=\"onLocationChange($event)\"></route>\n  ",
                        directives: [route_component_1.RouteComponent, map_component_1.MapComponent],
                        inputs: ['routeChange', 'locationChange']
                    }), 
                    __metadata('design:paramtypes', [])
                ], App);
                return App;
            })();
            exports_1("App", App);
        }
    }
});
//# sourceMappingURL=app.js.map