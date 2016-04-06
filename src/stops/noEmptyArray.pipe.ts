import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'noEmptyArray'
})
export class NoEmptyArrayPipe implements PipeTransform{
  public transform(value) {
    if (value.length === 0 ) return;
    return value;
  }
}