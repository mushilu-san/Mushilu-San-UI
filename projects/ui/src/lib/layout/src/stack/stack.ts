import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import type { StackAlign, StackDirection, StackJustify } from './stack.types';

const ALIGN_MAP: Record<StackAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const JUSTIFY_MAP: Record<StackJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

@Component({
  selector: 'mui-stack',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './stack.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[style.flex-direction]': 'direction()',
    '[style.align-items]': 'alignValue()',
    '[style.justify-content]': 'justifyValue()',
    '[style.flex-wrap]': 'wrap() ? "wrap" : "nowrap"',
    '[style.gap]': 'gapValue()',
    '[attr.part]': '"root"',
  },
})
export class Stack {
  /** Flex-direction of the stack's children. */
  direction = input<StackDirection>('column');

  /** Cross-axis alignment (align-items). */
  align = input<StackAlign>('stretch');

  /** Main-axis alignment (justify-content). */
  justify = input<StackJustify>('start');

  /** Gap between children — a step on the spacing scale (--mui-space-{n}), e.g. 0, 1, 2, 4, 8… */
  gap = input(4, { transform: numberAttribute });

  /** Whether children are allowed to wrap onto multiple lines. */
  wrap = input(false, { transform: booleanAttribute });

  protected readonly alignValue = computed(() => ALIGN_MAP[this.align()]);
  protected readonly justifyValue = computed(() => JUSTIFY_MAP[this.justify()]);
  protected readonly gapValue = computed(() => `var(--mui-space-${this.gap()}, 0px)`);
}
