System.register(['angular2/core', 'angular2/http', 'rxjs/add/operator/map', 'rxjs/add/operator/mergeMap'], function(exports_1) {
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
    var core_1, http_1;
    var URL, RouteService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {},
            function (_2) {}],
        execute: function() {
            URL = "http://webservices.nextbus.com/service/publicXMLFeed?a=ttc";
            RouteService = (function () {
                function RouteService(_http) {
                    this._http = _http;
                }
                RouteService.prototype.getBusLocations = function (num) {
                    var _this = this;
                    return this.query('vehicleLocations', "r=" + num, "t=2").map(function (res) {
                        return _this.attrArray(res, 'vehicle').map(function (bus) {
                            return {
                                id: +bus.getAttribute('id'),
                                routeTag: bus.getAttribute('routeTag'),
                                dirTag: bus.getAttribute('dirTag'),
                                lat: +bus.getAttribute('lat'),
                                lng: +bus.getAttribute('lon'),
                                heading: +bus.getAttribute('heading')
                            };
                        });
                    });
                };
                RouteService.prototype.getRouteList = function () {
                    var _this = this;
                    return this.query('routeList').map(function (routes) {
                        return _this.attrArray(routes, 'route').map(function (route) {
                            return {
                                tag: route.getAttribute('tag'),
                                title: route.getAttribute('title')
                            };
                        });
                    });
                };
                RouteService.prototype.getRoute = function (num) {
                    var _this = this;
                    return this.query('routeConfig', "r=" + num).map(function (routes) {
                        var coords = _this.attrArray(routes, 'path').map(function (path) {
                            return _this.attrArray(path, 'point').map(function (point) {
                                return {
                                    lat: +point.getAttribute('lat'),
                                    lng: +point.getAttribute('lon')
                                };
                            });
                        });
                        return { id: num, coords: coords };
                    });
                };
                RouteService.prototype.attrArray = function (xmlObj, attrName) {
                    var xmlNodes = xmlObj.querySelectorAll(attrName);
                    return jQuery.makeArray(xmlNodes);
                };
                RouteService.prototype.query = function (cmd) {
                    var options = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        options[_i - 1] = arguments[_i];
                    }
                    return this._http.get((URL + "&command=" + cmd + "&") + options.join('&'))
                        .map(function (res) { return jQuery.parseXML(res.text()); });
                };
                RouteService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], RouteService);
                return RouteService;
            }());
            exports_1("RouteService", RouteService);
        }
    }
});
//# sourceMappingURL=route.service.js.map