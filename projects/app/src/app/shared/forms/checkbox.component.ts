import { ChangeDetectionStrategy, Component, ContentChild, Directive, Input, NgModule } from '@angular/core';

let nextUniqueId = 0;

@Directive({
  selector: 'input[type=checkbox]',
  standalone: true,
  host: {
    class:
      'inline-block w-4 h-4 m-1 align-middle rounded border-2 focus:outline-none focus:ring-0 focus:border-purple-700',
    '[attr.id]': 'id',
  },
})
export class CheckboxDirective {
  @Input() id = `app-checkbox-${nextUniqueId++}`;
}

@Component({
  selector: 'app-form-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
    <label [attr.for]="inputId" class="text-sm">
      {{ label }}
    </label>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class CheckboxFormFieldComponent {
  @Input() showLabel = false;
  @Input() label = '';
  @ContentChild(CheckboxDirective) formControl?: CheckboxDirective;

  get inputId() {
    return this.formControl?.id;
  }
}

@NgModule({
  imports: [CheckboxFormFieldComponent, CheckboxDirective],
  exports: [CheckboxFormFieldComponent, CheckboxDirective],
})
export class CheckboxFieldModule {}
