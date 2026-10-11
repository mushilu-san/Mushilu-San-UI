import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import type { InputSize, InputVariant } from './input.types';
import { INPUT_GROUP_CONTEXT } from '../input-group/input-group';

@Component({
  selector: 'input[muiInput]',
  standalone: true,
  template: '',
  styleUrl: './input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-invalid]': 'effectiveInvalid() || null',
    '[attr.data-in-group]': 'groupCtx != null ? "" : null',
    '[attr.part]': '"input"',
  },
})
export class Input {
  /** Input height and text size: `sm`, `md` or `lg`. Default `md`. */
  size = input<InputSize>('md');
  /** Visual style: `outline`, `filled` or `ghost`. Default `outline`. */
  variant = input<InputVariant>('outline');
  /** Shows the failed-validation style and sets `data-invalid`. Does not set `aria-invalid`. */
  invalid = input(false, { transform: booleanAttribute });

  protected readonly groupCtx = inject(INPUT_GROUP_CONTEXT, { optional: true });
  protected readonly effectiveInvalid = computed(() => this.groupCtx?.invalid() || this.invalid());
}
