import { Pipe, PipeTransform } from '@angular/core';
import { asStat, calculateStatForNonHP, EV, IV, Level, NatureValue, Stat, StatValues } from '@lib/stats';
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

@Pipe({
  name: 'join',
  standalone: true,
})
export class JoinPipe implements PipeTransform {
  transform(value: readonly unknown[], delimiter = ','): string {
    return value.join(delimiter);
  }
}

@Pipe({
  name: 'calcStat',
  standalone: true,
})
export class CalcStatPipe implements PipeTransform {
  transform(base: number, params: { level: Level; iv: IV; ev: EV; nature: NatureValue }): Stat {
    return calculateStatForNonHP(asStat(base), params.level, params.iv, params.ev, params.nature);
  }
}
