import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  inject,
  Input,
  NgModule,
} from '@angular/core';

@Directive({
  selector: '[app-form-control]',
  standalone: true,
  host: {
    class:
      'block p-2 w-full text-base text-gray-900 rounded border border-solid border-gray-400 appearance-none placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-purple-700 peer',
    '[attr.aria-labelledby]': 'ariaLabelledBy',
  },
})
export class FormControlDirective {
  @Input('aria-labelledby') ariaLabelledBy?: string;
}

let nextUniqueId = 0;

@Component({
  selector: 'app-form-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="[app-form-control]"></ng-content>
    <label
      [style.display]="label && showLabel ? undefined : 'none'"
      [attr.id]="labelId"
      class="absolute text-xs text-gray-500 peer-focus:text-purple-700 origin-[0] bg-white px-1 top-2 -translate-y-4 left-1"
    >
      {{ label }}
    </label>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
      }
    `,
  ],
})
export class FormFieldComponent implements AfterContentInit {
  private readonly cdRef = inject(ChangeDetectorRef);

  @Input() showLabel = false;
  @Input() label = '';
  @ContentChild(FormControlDirective) formControl?: FormControlDirective;

  readonly labelId = `app-form-field-label-${nextUniqueId++}`;

  ngAfterContentInit() {
    if (this.formControl) {
      this.formControl.ariaLabelledBy ??= this.labelId;
      this.cdRef.markForCheck();
    }
  }
}

@NgModule({
  imports: [FormFieldComponent, FormControlDirective],
  exports: [FormFieldComponent, FormControlDirective],
})
export class FormFieldModule {}
