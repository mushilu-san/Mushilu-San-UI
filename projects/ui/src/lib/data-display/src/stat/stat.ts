import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

/** Stat — a figure (large value) above a label. Use inside `mui-stats` for list semantics. */
@Component({
  selector: 'mui-stat',
  standalone: true,
  template: `
    <span class="value" part="value">{{ value() }}</span>
    <span class="label" part="label">{{ label() }}</span>
    <ng-content />
  `,
  styleUrl: './stat.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    role: 'listitem',
    '[attr.part]': '"root"',
  },
})
export class Stat {
  /** The figure, e.g. `1,200` or `98%`. Pre-formatted by the caller. */
  value = input.required<string | number>();
  /** What the figure measures. */
  label = input.required<string>();
}
