import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mui-context-menu-separator',
  standalone: true,
  template: `<hr
    class="mui-context-menu-separator"
    part="separator"
    role="separator"
    aria-hidden="true"
  />`,
  styles: [
    `
      :host {
        display: contents;
      }
      .mui-context-menu-separator {
        margin: var(--mui-space-1) 0;
        border: none;
        border-top: 1px solid var(--mui-color-border);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ContextMenuSeparator {}
