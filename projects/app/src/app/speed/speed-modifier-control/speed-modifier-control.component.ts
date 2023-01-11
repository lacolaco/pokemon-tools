import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SpeedAbility, SpeedItem, SpeedModifier, StatRank } from '@lib/stats';
import { getValidValueChanges, SimpleControlValueAccessor } from '../../utitilites/forms';

@Component({
  selector: 'speed-modifier-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <label class="flex flex-col items-start justify-around">
      <span>ランク補正</span>
      <select [formControl]="form.controls.rank" class="form-select w-full">
        <option *ngFor="let option of rankOptions" [ngValue]="option.value">{{ option.label }}</option>
      </select>
    </label>
    <label class="flex flex-col items-start">
      <span>道具</span>
      <select [formControl]="form.controls.item" class="form-select w-full">
        <option *ngFor="let option of itemOptions" [ngValue]="option.value">{{ option.label }}</option>
      </select>
    </label>
    <label class="flex flex-col items-start">
      <span>特性</span>
      <select [formControl]="form.controls.ability" class="form-select w-full">
        <option *ngFor="let option of abilityOptions" [ngValue]="option.value">{{ option.label }}</option>
      </select>
    </label>
    <div [formGroup]="form.controls.condition" class="flex flex-col items-start">
      <span>その他</span>
      <label class="grid grid-cols-auto-1fr gap-x-1">
        <input type="checkbox" formControlName="paralysis" class="form-checkbox text-indigo-600" />
        <span>まひ</span>
      </label>
      <label class="grid grid-cols-auto-1fr gap-x-1">
        <input type="checkbox" formControlName="tailwind" class="form-checkbox text-indigo-600" />
        <span>おいかぜ</span>
      </label>
    </div>
  `,
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
