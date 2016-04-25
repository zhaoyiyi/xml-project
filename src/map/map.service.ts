import { Injectable, Inject } from 'angular2/core';
import * as Rx from 'rxjs/Rx';
import { ICONSET } from './icon';
import { zoom, addToBound, clear, clearMarker, animateMarker, addMarker } from './mapHelper';
import { getCurrentLocation } from './location';
import { Observable } from "rxjs/Observable";
import { StopPrediction } from '../interface';
declare var google, window;

@Injectable()
export class MapService {
  private _map;
  private _bound: any;
  private _lines: any;
  private _buses: any;
  private _stops: any;
  private _placeService: any;
  private _currentLocation: any;

  get isInitialized() {
    return !!this._map;
  }

  get currentLocation() {
    return getCurrentLocation();
  }

  // option to clean other lines before drawing
  public drawPath(routeInfo, clearPath = true) {
    if (clearPath) this.clearLine();
    // clears bounds
    if (this._bound) this._bound = new google.maps.LatLngBounds();
    this._lines = routeInfo.map(path => {
      let line = new google.maps.Polyline(ICONSET.line(path));
      line.setMap(this._map);
      //path.map(point => this.addToBound(point));
      path.map(point => addToBound(point, this._bound));
      //this.zoom();
      zoom(this._map, this._bound);
      return line;
    });
  }

  public clearLine() {
    if (this._lines) clear(this._lines);
  }

  // TODO:0 need better way to update buses on the Map
  // ie, add and delete without refreshing
  public updateMarker(newPosition) {
    if (this._buses && newPosition.length === this._buses.length) {
      console.log('updating bus locations...');
      this._buses.map((bus, idx) => {
        if (newPosition[idx] && bus.id === newPosition[idx].id) {
          animateMarker(bus.marker, newPosition[idx], 8000);
          bus.marker.setIcon(ICONSET.bus(google.maps.SymbolPath.FORWARD_CLOSED_ARROW, newPosition[idx]));
        }
      });
    } else {
      this.drawBuses(newPosition);
    }
  }

  public drawBuses(buses) {
    if (this._buses) clearMarker(this._buses);
    console.log('first time drawing buses for new route:');
    this._buses = buses.map(bus => {
      if (bus && bus.id) {
        return addMarker(this._map, bus, ICONSET.bus(google.maps.SymbolPath.FORWARD_CLOSED_ARROW, bus));
      }
    });
  }

  // TODO: adjust stop marker size when zoom in and out.
  // TODO: show stop information when clicking on it.
  public drawStops(stops: Array<StopPrediction>, infoContent?: Array<string>) {
    if (this._stops) clearMarker(this._stops);
    this._stops = stops.map((stop, index) => {
      const stop = addMarker(this._map, stop, ICONSET.stop(google.maps.SymbolPath.CIRCLE));
      if (infoContent) {
        const info = new google.maps.InfoWindow({
          content: infoContent[index]
        });
        stop.marker.addListener('click', () => info.open(this._map, stop.marker));
      }
      return stop;
    });
  }

  public setMapCenter(coords) {
    this._map.setCenter(coords);
    this._map.setZoom(18);
  }


  // init //
  public loadMap(mapName) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAlWFKOQSQvQx2Xr9qw7i8siK7ktQlGcco&callback=initMap&libraries=places`;
    document.body.appendChild(script);
    // attach initMap to window
    (window)['initMap'] = () => this.initMap(mapName);
  }

  // init callback
  private initMap(mapName) {
    this._map = new google.maps.Map(document.querySelector(mapName), {
      center: { lat: 43.646389, lng: -79.408959 },
      zoom: 15
    });

    this._bound = new google.maps.LatLngBounds();
    this._placeService = new google.maps.places.PlacesService(this._map);
    getCurrentLocation().subscribe(pos => {
      addMarker(this._map, pos, ICONSET.me(google.maps.SymbolPath.CIRCLE));
      // set current location
      this._currentLocation = pos;
      // set map center
      this._map.setCenter(this._currentLocation);
    });
  }
}


