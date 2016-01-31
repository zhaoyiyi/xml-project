import {Injectable} from 'angular2/core';
declare var google;
declare var GeolocationMarker;

@Injectable()
export class MapService{
  private _map: any;
  private _bound: any;
  private _lines: any;
  private _buses: any;

  get isInitialized() {return !!this._map}

  // option to clean other lines before drawing
  drawPath(paths, clear=true){
    if(this._lines && clear) this.clear(this._lines);
    // clears bounds
    if(this._bound) this._bound = new google.maps.LatLngBounds();
    this._lines = paths.map( path => {
      let line = new google.maps.Polyline({
        path: path,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      line.setMap(this._map);
      path.map( point => this.addToBound(point) );
      this.zoom();
      return line;
    });

  }
  // TODO:20 need better way to update buses on the Map
  // ie, add and delete without refreshing
  updateMarker(newPosition){
    if(this._buses && newPosition.length === this._buses.length ){
      console.log('updating bus locations...');
      this._buses.map( (bus, idx) => {
        if(bus.id === newPosition[idx].id){
          this.animateMarker(bus.marker, newPosition[idx], 8000);
          bus.marker.setIcon( this.iconOption(newPosition[idx]) );
        }
      });
    }else{
      this.setMarker(newPosition);
    }
  }
  setMarker(buses){
    if(this._buses) this.clearBuses(this._buses);
    console.log('first time drawing buses for new route:');
    this._buses = buses.map( bus => {
      let marker = new google.maps.Marker({
        position: {lat: bus.lat, lng: bus.lng},
        icon: this.iconOption(bus),
        map: this._map
      });
      return {
        id: bus.id,
        marker: marker
      };
    });

  }
  // clears stored info on the map.
  private clear(obj){
    if(obj){
      obj.map( line => line.setMap(null));
    }
  }
  private clearBuses(buses){
    if(buses){
      buses.map( bus => bus.marker.setMap(null));
    }
  }

  private animateMarker(marker, coords, time=5000){
    let lat = marker.getPosition().lat();
    let lng = marker.getPosition().lng();
    let latDiff = coords.lat - lat;
    let lngDiff = coords.lng - lng;
    let stepNum = time / 20;
    let i = 0;

    let animation = setInterval( () => {
      if(i >= stepNum ) {
        clearInterval(animation);
      }else{
        lat += latDiff / stepNum;
        lng += lngDiff / stepNum;
        marker.setPosition({lat: lat, lng: lng});
        i++;
      }
    }, 20);
  }
  private iconOption(option){
    return {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 5,
      strokeWeight: 2,
      strokeColor: '#00F',
      rotation: option.heading
    }
  }
  private addToBound(coord){
    let c = new google.maps.LatLng( coord.lat, coord.lng );
    this._bound.extend(c);


  }
  private zoom(){
    this._map.fitBounds(this._bound);
    this._map.panToBounds(this._bound);
  }

  // init //
  loadMap(mapName){
    let script = document.createElement('script');
    script.type = 'text/javascript'
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAlWFKOQSQvQx2Xr9qw7i8siK7ktQlGcco&callback=initMap`;
    document.body.appendChild(script);

    // attach initMap to window
    (window)['initMap'] = () => this.initMap(mapName);
  }

  private initMap(mapName) {
    this._map = new google.maps.Map(document.querySelector(mapName), {
     center: {
       lat: 43.646389,
       lng: -79.408959
     },
     zoom: 13
    });
    this._bound = new google.maps.LatLngBounds();
    this.setCurrentLocation();
  }
  private setCurrentLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( position => {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        this._map.setCenter(pos);

        let marker = new google.maps.Marker({
          position: pos,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5,
            strokeWeight: 1,
            fillColor: '#F00',
            fillOpacity: 1,
            strokeColor: '#00F'
          },
          map: this._map
        });
      });
    } else {
      // Browser doesn't support Geolocation
      alert('sorry, your browser does not support html5 geolocation');
    }
  }

}
