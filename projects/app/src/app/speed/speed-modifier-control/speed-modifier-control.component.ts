import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SpeedAbility, SpeedItem, SpeedModifier, StatRank } from '@lib/stats';
import { getValidValueChanges, SimpleControlValueAccessor } from '../../utitilites/forms';

@Component({
  selector: 'speed-modifier-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatCheckboxModule],
  template: `
    <div class="w-full grid grid-flow-row gap-y-2">
      <mat-form-field appearance="outline" floatLabel="always" subscriptSizing="dynamic">
        <mat-label>ランク補正</mat-label>
        <select matNativeControl [formControl]="form.controls.rank" class="w-full">
          <option *ngFor="let option of rankOptions" [ngValue]="option.value">{{ option.label }}</option>
        </select>
      </mat-form-field>
      <mat-form-field appearance="outline" floatLabel="always" subscriptSizing="dynamic">
        <mat-label>道具</mat-label>
        <select matNativeControl [formControl]="form.controls.item" class="w-full">
          <option *ngFor="let option of itemOptions" [ngValue]="option.value">{{ option.label }}</option>
        </select>
      </mat-form-field>
      <mat-form-field appearance="outline" floatLabel="always" subscriptSizing="dynamic">
        <mat-label>特性</mat-label>
        <select matNativeControl [formControl]="form.controls.ability" class="w-full">
          <option *ngFor="let option of abilityOptions" [ngValue]="option.value">{{ option.label }}</option>
        </select>
      </mat-form-field>
      <div [formGroup]="form.controls.condition" class="grid grid-flow-row gap-y-1">
        <span class="text-xs">その他</span>
        <mat-checkbox formControlName="paralysis" class="text-sm">まひ</mat-checkbox>
        <mat-checkbox formControlName="tailwind" class="text-sm">おいかぜ</mat-checkbox>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        --mdc-checkbox-state-layer-size: 24px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeedModifierControlComponent extends SimpleControlValueAccessor<SpeedModifier> implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly form = this.fb.group({
    rank: this.fb.control<StatRank>(0),
    item: this.fb.control<SpeedItem | null>(null),
    ability: this.fb.control<SpeedAbility | null>(null),
    condition: this.fb.group({
      paralysis: this.fb.control(false),
      tailwind: this.fb.control(false),
    }),
  });

  readonly rankOptions: { label: string; value: StatRank }[] = [
    { label: '+6', value: 6 },
    { label: '+5', value: 5 },
    { label: '+4', value: 4 },
    { label: '+3', value: 3 },
    { label: '+2', value: 2 },
    { label: '+1', value: 1 },
    { label: '-', value: 0 },
    { label: '-1', value: -1 },
    { label: '-2', value: -2 },
    { label: '-3', value: -3 },
    { label: '-4', value: -4 },
    { label: '-5', value: -5 },
    { label: '-6', value: -6 },
  ];

  readonly itemOptions: { label: string; value: SpeedItem | null }[] = [
    { label: '-', value: null },
    { label: 'こだわりスカーフ', value: 'こだわりスカーフ' },
    { label: 'くろいてっきゅう', value: 'くろいてっきゅう' },
  ];

  readonly abilityOptions: { label: string; value: SpeedAbility | null }[] = [
    { label: '-', value: null },
    { label: 'かるわざ', value: 'かるわざ' },
    { label: 'すいすい', value: 'すいすい' },
    { label: 'すなかき', value: 'すなかき' },
    { label: 'ゆきかき', value: 'ゆきかき' },
    { label: 'ようりょくそ', value: 'ようりょくそ' },
    { label: 'はやあし', value: 'はやあし' },
    { label: 'スロースタート', value: 'スロースタート' },
    { label: 'サーフテール', value: 'サーフテール' },
  ];

  ngOnInit() {
    getValidValueChanges(this.form)
      .pipe(this.takeUntilDestroyed())
      .subscribe((value) => this.onChange(value));
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }
  writeValue(value: SpeedModifier): void {
    this.form.setValue(value);
  }
}
