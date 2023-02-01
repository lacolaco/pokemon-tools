import { Directive } from '@angular/core';

@Directive({
  selector: 'button[app-icon-button]',
  standalone: true,
  host: {
    class: 'h-12 w-12 p-3 rounded-full',
  },
})
export class AppIconButton {}
