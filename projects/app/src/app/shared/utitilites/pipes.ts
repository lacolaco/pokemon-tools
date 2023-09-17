import { Pipe, PipeTransform } from '@angular/core';
import { StatValues } from '@lib/stats';
import { joinStatValues } from './strings';

@Pipe({
  name: 'joinStatValues',
  standalone: true,
})
export class JoinStatValuesPipe implements PipeTransform {
  transform(value: StatValues<number | null>, delimiter = '-'): string {
    return joinStatValues(value, delimiter);
  }
}

@Pipe({
  name: 'join',
  standalone: true,
})
export class JoinPipe implements PipeTransform {
  transform(value: readonly unknown[], delimiter = ','): string {
    return value.join(delimiter);
  }
}
