import { NgForOf } from '@angular/common';
import { Directive, Input, NgIterable, inject } from '@angular/core';

@Directive({
  selector: '[ngForTrackByProp]',
  standalone: true,
})
export class NgForTrackByProp<T> {
  @Input() ngForOf!: NgIterable<T>;

  @Input()
  set ngForTrackByProp(ngForTrackBy: keyof T) {
    // setter
    this.ngFor.ngForTrackBy = (index: number, item: T) => item[ngForTrackBy];
  }

  private ngFor = inject(NgForOf<T>, { self: true });
}

@Directive({
  selector: '[ngForTrackByIndex]',
  standalone: true,
})
export class NgForTrackByIndex<T> {
  @Input() ngForOf!: NgIterable<T>;

  private ngFor = inject(NgForOf<T>, { self: true });

  constructor() {
    this.ngFor.ngForTrackBy = (index: number) => index;
  }
}
