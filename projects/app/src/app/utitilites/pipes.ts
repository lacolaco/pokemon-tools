import { Pipe, PipeTransform } from '@angular/core';
import { StatValues } from '@lib/model';
import { joinStatValues } from './strings';

@Pipe({
  name: 'joinStatValues',
  standalone: true,
})
export class JoinStatValuesPipe implements PipeTransform {
  transform(value: StatValues<number>, delimiter = '-'): string {
    return joinStatValues(value, delimiter);
  }
}
