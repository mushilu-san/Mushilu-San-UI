import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mui-command-separator',
  standalone: true,
  template: `<hr
    class="mui-command-separator"
    part="separator"
    role="separator"
    aria-hidden="true"
  />`,
  styles: [
    `
      :host {
        display: contents;
      }
      .mui-command-separator {
        margin: var(--mui-space-1) 0;
        border: none;
        border-top: 1px solid var(--mui-color-border);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class CommandSeparator {}
