import { Pipe, PipeTransform } from '@angular/core';
import { SpeedModifier } from '@lib/stats';

@Pipe({
  name: 'speedModifier',
  standalone: true,
})
export class SpeedModifierPipe implements PipeTransform {
  transform(value: SpeedModifier): string {
    return JSON.stringify(value);
  }
}
