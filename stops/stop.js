var fs = require('fs');

fs.readFile('stops.txt', (err, data) => {
  var stops = data.toString().split('\r\n');
  var output = stops.map( stop => {
    var stopArray = stop.split(',');
    return {
      id: stopArray[1],
      //name: stopArray[2],
      lat: stopArray[4],
      lng: stopArray[5]
    };
  });
  fs.writeFile('stops.json', JSON.stringify(output), (err) => {
    if (err) {return console.log(err);}
    console.log('finish writing file');
  });
});