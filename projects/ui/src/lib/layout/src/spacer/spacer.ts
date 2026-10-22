import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

// numberAttribute(null | undefined) is NaN, which would defeat the `??` fallback / grow check.
const optionalNumber = (v: unknown): number | undefined =>
  v == null ? undefined : numberAttribute(v);

@Component({
  selector: 'mui-spacer',
  standalone: true,
  template: '',
  styleUrl: './spacer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.aria-hidden]': '"true"',
    '[style.flex]': 'flexValue()',
    '[style.width]': 'dimension()',
    '[style.height]': 'dimension()',
    '[attr.part]': '"root"',
  },
})
export class Spacer {
  /**
   * Fixed size — a step on the spacing scale (--mui-space-{n}).
   * When omitted, the spacer grows to fill available space (`flex: 1 1 0%`)
   * — the common "push items apart" pattern inside a Stack/flex row.
   */
  size = input<number | undefined, unknown>(undefined, { transform: optionalNumber });

  protected readonly flexValue = computed(() =>
    this.size() === undefined ? '1 1 0%' : '0 0 auto',
  );
  protected readonly dimension = computed(() => {
    const size = this.size();
    return size === undefined ? null : `var(--mui-space-${size}, 0px)`;
  });
}
