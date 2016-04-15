export interface StopPrediction {
  dir: Array<Dir>;
  dirNoPrediction;
  routeTag: string;
  routeTitle: string;
  stopTitle: string;
  lat: string;
  lng: string;
}

interface Dir {
  prediction: Array<Prediction>;
  title: string;
}

interface Prediction {
  isDeparture: boolean;
  min: string;
  sec: string;
  time: string;
}