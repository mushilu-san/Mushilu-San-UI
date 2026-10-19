import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

@Component({
  selector: 'mui-command-list',
  standalone: true,
  template: `<div class="mui-command-list" part="list" role="listbox" [attr.aria-label]="label()">
    <ng-content />
  </div>`,
  styles: [
    `
      :host {
        display: block;
      }
      .mui-command-list {
        overflow-y: auto;
        max-block-size: 320px;
        padding: var(--mui-space-1) 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class CommandList {
  /** Accessible name of the listbox (#726). */
  label = input('Results');
}
