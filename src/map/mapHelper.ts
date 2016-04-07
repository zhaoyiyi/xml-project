
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
  const oldPos = {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()};
  const newPos = {lat: coords.lat, lng: coords.lng};
  $(oldPos).animate(newPos, {
    duration: time,
    step: function (now, fx) {
      marker.setPosition({lat: fx.elem.lat, lng: fx.elem.lng});
    }
  });
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
