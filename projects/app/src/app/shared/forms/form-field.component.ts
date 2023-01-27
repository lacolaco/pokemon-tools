import { ChangeDetectionStrategy, Component, ContentChild, Directive, Input, NgModule } from '@angular/core';

let nextUniqueId = 0;

@Directive({
  selector: '[app-form-control]',
  standalone: true,
  host: {
    class:
      'block p-2 w-full text-base text-gray-900 rounded border border-solid border-gray-400 appearance-none placeholder:text-transparent focus:outline-none focus:ring-0 focus:border-purple-700 peer',
    '[attr.id]': 'id',
  },
})
export class FormControlDirective {
  @Input('aria-labelledby') id = `app-form-control-${nextUniqueId++}`;
}

@Component({
  selector: 'app-form-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="[app-form-control]"></ng-content>
    <label
      [style.display]="label && showLabel ? undefined : 'none'"
      [attr.for]="inputId"
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
export class FormFieldComponent {
  @Input() showLabel = false;
  @Input() label = '';
  @ContentChild(FormControlDirective) formControl?: FormControlDirective;

  get inputId() {
    return this.formControl?.id;
  }
}

@NgModule({
  imports: [FormFieldComponent, FormControlDirective],
  exports: [FormFieldComponent, FormControlDirective],
})
export class FormFieldModule {}
