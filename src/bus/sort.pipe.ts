import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'sort'
})
export class Sort {
  public transform(value: Array<string>, arg: string) {
    return value;
  }
}
