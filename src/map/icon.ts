declare var google;
// Icon settings
export const ICONSET = {
  stop: function stop(path) {
    return {
      path: path,
      scale: 3,
      strokeWeight: 1,
      fillColor: '#04C8EF',
      fillOpacity: 1,
      strokeColor: '#00F'
    };
  },
  bus: function bus(path, option) {
    return {
      path: path,
      scale: 5,
      strokeWeight: 2,
      strokeColor: '#00F',
      rotation: option ? option.heading : 0
    };
  },
  me: function me(path) {
    return {
      path: path,
      scale: 5,
      strokeWeight: 1,
      fillColor: '#F00',
      fillOpacity: 1,
      strokeColor: '#00F'
    };
  },
  line: function line(path) {
    return {
      path: path,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    };
  }
};
