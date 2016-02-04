import {Injectable, Inject} from 'angular2/core';
import * as Rx from 'rxjs/Rx';
import {ICONSET} from './icon';
declare var google;

@Injectable()
export class MapService {
  private _map: any;
  private _bound: any;
  private _lines: any;
  private _linesTest: any = [];
  private _buses: any;
  private _stops: any;

  get isInitialized() { return !!this._map; }

  constructor() {}

  // test
  public clearPath() {
    if (this._linesTest) this.clear(this._linesTest);
  }
  public testDrawPath(path) {
    let line = new google.maps.Polyline(ICONSET.line(path));
    line.setMap(this._map);
    this._linesTest.push(line);
  }

  // option to clean other lines before drawing
  public drawPath(routeInfo, clear = true) {
    if (this._lines && clear) this.clear(this._lines);
    // clears bounds
    if (this._bound) this._bound = new google.maps.LatLngBounds();
    this._lines = routeInfo.map( path => {
      let line = new google.maps.Polyline(ICONSET.line(path));
      line.setMap(this._map);
      path.map( point => this.addToBound(point) );
      this.zoom();
      return line;
    });
  }

  // TODO:0 need better way to update buses on the Map
  // ie, add and delete without refreshing
  public updateMarker(newPosition) {
    if (this._buses && newPosition.length === this._buses.length ) {
      console.log('updating bus locations...');
      this._buses.map( (bus, idx) => {
        if ( newPosition[idx] && bus.id === newPosition[idx].id ) {
          this.animateMarker(bus.marker, newPosition[idx], 8000);
          bus.marker.setIcon( ICONSET.bus(google.maps.SymbolPath.FORWARD_CLOSED_ARROW, newPosition[idx]) );
        }
      });
    }else {
      this.drawBuses(newPosition);
    }
  }
  public drawBuses(buses) {
    if (this._buses) this.clearMarker(this._buses);
    console.log('first time drawing buses for new route:');
    this._buses = buses.map( bus => {
      if (bus && bus.id) {
        return this.addMarker(bus, ICONSET.bus(google.maps.SymbolPath.FORWARD_CLOSED_ARROW, bus));
      }
    });
  }
  // TODO: adjust stop marker size when zoom in and out.
  // TODO: show stop information when clicking on it.
  public drawStops(stops) {
    if (this._stops) this.clearMarker(this._stops);
    this._stops = stops.map( stop => {
      return this.addMarker(stop, ICONSET.stop(google.maps.SymbolPath.CIRCLE));
    });
  }
  // init //
  public loadMap(mapName) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAlWFKOQSQvQx2Xr9qw7i8siK7ktQlGcco&callback=initMap`;
    document.body.appendChild(script);

    // attach initMap to window
    (window)['initMap'] = () => this.initMap(mapName);
  }
  private addMarker(info, icon) {
    let marker = new google.maps.Marker({
      position: {lat: +info.lat, lng: +info.lng},
      icon: icon,
      map: this._map
    });
    return {
      id: info.id,
      marker: marker
    };
  }
  // clears stored info on the map.
  private clear(obj) {
    if (obj) {
      obj.map( line => line.setMap(null));
    }
  }
  private clearMarker(buses) {
    if (buses) {
      buses.map( bus => bus && bus.marker.setMap(null));
    }
  }

  // good
  private animateMarker(marker, coords, time = 5000) {
    let lat = marker.getPosition().lat();
    let lng = marker.getPosition().lng();
    let latDiff = coords.lat - lat;
    let lngDiff = coords.lng - lng;
    let stepNum = time / 20;
    let i = 0;
    let animation = setInterval( () => {
      if (i >= stepNum ) {
        clearInterval(animation);
      }else {
        lat += latDiff / stepNum;
        lng += lngDiff / stepNum;
        marker.setPosition({lat: lat, lng: lng});
        i++;
      }
    }, 20);
  }
  private addToBound(coord) {
    let c = new google.maps.LatLng( coord.lat, coord.lng );
    this._bound.extend(c);
  }
  private zoom() {
    this._map.fitBounds(this._bound);
    this._map.panToBounds(this._bound);
  }
  private initMap(mapName) {
    this._map = new google.maps.Map(document.querySelector(mapName), {
     center: { lat: 43.646389, lng: -79.408959 },
     zoom: 13
    });
    this._bound = new google.maps.LatLngBounds();
    this.setCurrentLocation();
  }
  private setCurrentLocation() {
    if (navigator.geolocation) {
      console.log('locating...');
      navigator.geolocation.getCurrentPosition( position => {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this._map.setCenter(pos);
        let marker = new google.maps.Marker({
          position: pos,
          icon: ICONSET.me(google.maps.SymbolPath.CIRCLE),
          map: this._map
        });
        console.log('get current location');
      }, (err) => console.log('failed to get current location', err));
    } else {
      // Browser doesn't support Geolocation
      alert('sorry, your browser does not support html5 geolocation');
    }
  }

}
