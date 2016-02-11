import {Pipe, PipeTransform} from 'angular2/core';
@Pipe({
  name: 'prediction'
})
export class PredictionPipe implements PipeTransform {
  public transform(value) {
    if (value.length <= 1) {
      return value.min;
    }else {
      return value.reduce( (prev, curr) => {
        return `${prev.min || prev} & ${curr.min}`;
      });
    }
  }
}
