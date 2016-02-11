import * as Rx from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

// TODO: make only one location request
export function getCurrentLocation(): Observable {
  if (navigator.geolocation) {
    return Rx.Observable.create((observer) => {
      navigator.geolocation.getCurrentPosition(position => {
        console.log('getting current location...');
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        observer.next(pos);
        observer.complete();
      });
    });
  }
}
