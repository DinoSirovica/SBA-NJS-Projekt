import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'monthNumber'
})
export class MonthNumberPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (value.length === 1) {
      return '0' + value;
    }
    return value;
  }

}
