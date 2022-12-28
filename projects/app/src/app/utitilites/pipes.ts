import { Pipe, PipeTransform } from '@angular/core';
import { sum } from '@lib/calc';

@Pipe({
  name: 'sum',
  standalone: true,
})
export class SumPipe implements PipeTransform {
  transform(value: number[]): number {
    return sum(value);
  }
}