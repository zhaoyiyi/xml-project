declare var google;
export function addToBound(coord, bound) {
  let c = new google.maps.LatLng(coord.lat, coord.lng);
  bound.extend(c);
}
export function zoom(map, bound) {
  map.fitBounds(bound);
  map.panToBounds(bound);
}
// clears stored info on the map.
export function clear(obj) {
  if (obj) {
    obj.map(line => line.setMap(null));
  }
}
export function clearMarker(buses) {
  if (buses) {
    buses.map(bus => bus && bus.marker.setMap(null));
  }
}
export function animateMarker(marker, coords, time = 5000) {
  let lat = marker.getPosition().lat();
  let lng = marker.getPosition().lng();
  let latDiff = coords.lat - lat;
  let lngDiff = coords.lng - lng;
  let stepNum = time / 20;
  let i = 0;
  let animation = setInterval(() => {
    if (i >= stepNum) {
      clearInterval(animation);
    } else {
      lat += latDiff / stepNum;
      lng += lngDiff / stepNum;
      marker.setPosition({lat: lat, lng: lng});
      i++;
    }
  }, 20);
}
export function addMarker(map, info, icon) {
  let marker = new google.maps.Marker({
    position: {lat: +info.lat, lng: +info.lng},
    icon: icon,
    map: map
  });
  return {
    id: info.id,
    marker: marker
  };
}
