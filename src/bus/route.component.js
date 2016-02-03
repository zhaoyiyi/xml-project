System.register(['angular2/core', 'angular2/http', 'angular2/common', 'rxjs/add/operator/combineLatest', './route.service'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, common_1, route_service_1;
    var RouteComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (_1) {},
            function (route_service_1_1) {
                route_service_1 = route_service_1_1;
            }],
        execute: function() {
            RouteComponent = (function () {
                function RouteComponent(_routeService) {
                    var _this = this;
                    this._routeService = _routeService;
                    this.routeControl = new common_1.Control('');
                    this.routeChange = new core_1.EventEmitter();
                    this.locationChange = new core_1.EventEmitter();
                    this.routeControl.valueChanges.subscribe(function (routeNum) {
                        console.log('selected route: ', routeNum);
                        console.log('emitting route info...');
                        _this.routeChange.emit(_this._routeService.getRoute(routeNum));
                        console.log('emitting bus locations...');
                        _this.locationChange.emit(_this._routeService.getBusLocations(routeNum));
                        _this._routeService.testRoute(routeNum)
                            .subscribe(function (data) { return console.log(data); });
                    }, function (err) { return console.log('err in route component when emitting', err); });
                }
                RouteComponent.prototype.ngOnInit = function () {
                    this.getRouteList();
                };
                RouteComponent.prototype.getRouteList = function () {
                    var _this = this;
                    this._routeService.getRouteList().subscribe(function (data) { return _this.routes = data; }, function (err) { return console.log(err); }, function () { return console.log('finish loading route list'); });
                };
                RouteComponent = __decorate([
                    core_1.Component({
                        selector: 'route',
                        template: "\n    <h2>Route List</h2>\n    <select [ngFormControl]=\"routeControl\">\n      <option *ngFor=\"#route of routes\" [value]=\"route.tag\">{{route.title}}</option>\n    </select>\n  ",
                        outputs: ['routeChange', 'locationChange'],
                        providers: [http_1.HTTP_PROVIDERS, route_service_1.RouteService]
                    }), 
                    __metadata('design:paramtypes', [route_service_1.RouteService])
                ], RouteComponent);
                return RouteComponent;
            })();
            exports_1("RouteComponent", RouteComponent);
        }
    }
});
//# sourceMappingURL=route.component.js.map