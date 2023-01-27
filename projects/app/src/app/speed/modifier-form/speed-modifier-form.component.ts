import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SpeedModifier } from '@lib/stats';
import { merge, tap } from 'rxjs';
import { getValidValueChanges } from '../../utitilites/forms';
import { SpeedModifierControlComponent } from '../speed-modifier-control/speed-modifier-control.component';
import { defaultSpeedModifier, SpeedPageState } from '../speed.state';

@Component({
  selector: 'speed-modifier-form',
  standalone: true,
  template: `
    <form [formGroup]="form" class="h-full w-[30vw] overflow-auto flex flex-col items-start gap-y-2 text-sm">
      <div formGroupName="ally" class="w-full grid grid-flow-row gap-y-2 border-b border-b-gray-500">
        <div class="font-bold">自分側</div>
        <speed-modifier-control formControlName="modifier" class="w-full"></speed-modifier-control>
      </div>
      <div formGroupName="opponent" class="w-full grid grid-flow-row gap-y-2">
        <div class="font-bold">相手側</div>
        <speed-modifier-control formControlName="modifier" class="w-full"></speed-modifier-control>
      </div>
    </form>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, SpeedModifierControlComponent],
})
export class SpeedModifierFormComponent implements OnInit {
  private readonly state = inject(SpeedPageState);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly form = this.fb.group({
    ally: this.fb.group({
      modifier: this.fb.control<SpeedModifier>(defaultSpeedModifier),
    }),
    opponent: this.fb.group({
      modifier: this.fb.control<SpeedModifier>(defaultSpeedModifier),
    }),
  });

  ngOnInit() {
    merge(
      getValidValueChanges(this.form.controls.ally.controls.modifier).pipe(
        tap((value) => {
          this.state.set({ allyModifier: value });
        }),
      ),
      getValidValueChanges(this.form.controls.opponent.controls.modifier).pipe(
        tap((value) => {
          this.state.set({ opponentModifier: value });
        }),
      ),
    )
      .pipe()
      .subscribe();
  }
}
