import {Injectable} from 'angular2/core';
declare var google;


@Injectable()
export class MapService{
  private _map: any;
  private _lines: any;
  private _buses: any;

  get isInitialized() {return !!this._map}



  // clears stored info on the map.
  clear(obj){
    console.log('route:', obj);
    if(obj){
      obj.map( line => line.setMap(null));
    }
  }
  clearBuses(buses){
    if(buses){
      buses.map( bus => bus.marker.setMap(null));
    }
  }
  // option to clean other lines before drawing
  drawPath(paths, clear=true){
    if(this._lines && clear) this.clear(this._lines);

    this._lines = paths.map( path => {
      let line = new google.maps.Polyline({
        path: path,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      })
      line.setMap(this._map);
      return line;
    });

  }

  animateMarker(marker, coords, time=5000){
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
  // TODO: need better way to update buses on the Map
  // ie, add and delete without refreshing
  updateMarker(newPosition){
    if(this._buses){
      console.log('updating bus locations...',this._buses);
      this._buses.map( (bus, idx) => {
        if(newPosition.length === this._buses.length && bus.id === newPosition[idx].id){
          this.animateMarker(bus.marker, newPosition[idx], 5000);
          bus.marker.setIcon( this.iconOption(newPosition[idx]) );
        }else{
          this.setMarker(newPosition[idx])
        }
      });
    }

  }

  iconOption(option){
    return {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      scale: 5,
      strokeWeight: 2,
      strokeColor: '#00F',
      rotation: option.heading
    }
  }

  setMarker(buses){
    if(this._buses) this.clearBuses(this._buses);
    console.log('buses in bus service:',this._buses);
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

  initMap(mapName) {
    this._map = new google.maps.Map(document.querySelector(mapName), {
     center: {
       lat: 43.646389,
       lng: -79.408959
     },
     zoom: 13
    });
  }
}
