export function getCurrentLocation(callback) {
  if (navigator.geolocation) {
    console.log('locating...');
    navigator.geolocation.getCurrentPosition(position => {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      callback(pos);
      console.log('get current location');

      return pos;
    }, (err) => console.log('failed to get current location', err));
  } else {
    // Browser doesn't support Geolocation
    alert('sorry, your browser does not support html5 geolocation');
  }
}
