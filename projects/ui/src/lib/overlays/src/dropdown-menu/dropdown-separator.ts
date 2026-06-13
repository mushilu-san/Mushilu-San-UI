import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mui-dropdown-separator',
  standalone: true,
  template: `<hr class="mui-dropdown-separator" part="separator" />`,
  styles: [
    `
      :host {
        display: block;
      }
      .mui-dropdown-separator {
        border: none;
        border-top: 1px solid var(--mui-color-border);
        margin: var(--mui-space-1) 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DropdownSeparator {}
