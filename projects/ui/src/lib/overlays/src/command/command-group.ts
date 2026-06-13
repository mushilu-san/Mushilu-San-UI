import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

@Component({
  selector: 'mui-command-group',
  standalone: true,
  template: `
    <div class="mui-command-group" part="group" role="group" [attr.aria-label]="label()">
      @if (label()) {
        <div class="mui-command-group__label" part="group-label">{{ label() }}</div>
      }
      <ng-content />
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
      .mui-command-group {
        padding: var(--mui-space-1) 0;
      }
      .mui-command-group + .mui-command-group {
        border-top: 1px solid var(--mui-color-border);
      }
      .mui-command-group__label {
        padding: var(--mui-space-1) var(--mui-space-3);
        font-family: var(--mui-font-sans);
        font-size: 11px;
        font-weight: var(--mui-font-weight-medium);
        color: var(--mui-color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class CommandGroup {
  label = input<string>();
}
