System.register(['angular2/core'], function(exports_1) {
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
    var core_1;
    var MapService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            MapService = (function () {
                function MapService() {
                }
                Object.defineProperty(MapService.prototype, "isInitialized", {
                    get: function () { return !!this._map; },
                    enumerable: true,
                    configurable: true
                });
                MapService.prototype.clear = function (obj) {
                    console.log('route:', obj);
                    if (obj) {
                        obj.map(function (line) { return line.setMap(null); });
                    }
                };
                MapService.prototype.clearBuses = function (buses) {
                    if (buses) {
                        buses.map(function (bus) { return bus.marker.setMap(null); });
                    }
                };
                MapService.prototype.drawPath = function (paths, clear) {
                    var _this = this;
                    if (clear === void 0) { clear = true; }
                    if (this._lines && clear)
                        this.clear(this._lines);
                    this._lines = paths.map(function (path) {
                        var line = new google.maps.Polyline({
                            path: path,
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        });
                        line.setMap(_this._map);
                        return line;
                    });
                };
                MapService.prototype.animateMarker = function (marker, coords, time) {
                    if (time === void 0) { time = 5000; }
                    var lat = marker.getPosition().lat();
                    var lng = marker.getPosition().lng();
                    var latDiff = coords.lat - lat;
                    var lngDiff = coords.lng - lng;
                    var stepNum = time / 20;
                    var i = 0;
                    var animation = setInterval(function () {
                        if (i >= stepNum) {
                            clearInterval(animation);
                        }
                        else {
                            lat += latDiff / stepNum;
                            lng += lngDiff / stepNum;
                            marker.setPosition({ lat: lat, lng: lng });
                            i++;
                        }
                    }, 20);
                };
                MapService.prototype.updateMarker = function (newPosition) {
                    var _this = this;
                    if (this._buses) {
                        console.log('updating bus locations...', this._buses);
                        this._buses.map(function (bus, idx) {
                            if (newPosition.length === _this._buses.length && bus.id === newPosition[idx].id) {
                                _this.animateMarker(bus.marker, newPosition[idx], 5000);
                                bus.marker.setIcon(_this.iconOption(newPosition[idx]));
                            }
                            else {
                                _this.setMarker(newPosition[idx]);
                            }
                        });
                    }
                };
                MapService.prototype.iconOption = function (option) {
                    return {
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 5,
                        strokeWeight: 2,
                        strokeColor: '#00F',
                        rotation: option.heading
                    };
                };
                MapService.prototype.setMarker = function (buses) {
                    var _this = this;
                    if (this._buses)
                        this.clearBuses(this._buses);
                    console.log('buses in bus service:', this._buses);
                    this._buses = buses.map(function (bus) {
                        var marker = new google.maps.Marker({
                            position: { lat: bus.lat, lng: bus.lng },
                            icon: _this.iconOption(bus),
                            map: _this._map
                        });
                        return {
                            id: bus.id,
                            marker: marker
                        };
                    });
                };
                MapService.prototype.loadMap = function (mapName) {
                    var _this = this;
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.async = true;
                    script.defer = true;
                    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAlWFKOQSQvQx2Xr9qw7i8siK7ktQlGcco&callback=initMap";
                    document.body.appendChild(script);
                    (window)['initMap'] = function () { return _this.initMap(mapName); };
                };
                MapService.prototype.initMap = function (mapName) {
                    this._map = new google.maps.Map(document.querySelector(mapName), {
                        center: {
                            lat: 43.646389,
                            lng: -79.408959
                        },
                        zoom: 13
                    });
                };
                MapService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], MapService);
                return MapService;
            }());
            exports_1("MapService", MapService);
        }
    }
});
//# sourceMappingURL=map.service.js.map