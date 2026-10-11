import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';
import type { TextareaResize, TextareaSize, TextareaVariant } from './textarea.types';

@Component({
  selector: 'textarea[muiTextarea]',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './textarea.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-invalid]': 'invalid() || null',
    '[attr.data-resize]': 'resize()',
    '[attr.part]': '"textarea"',
  },
})
export class Textarea {
  /** Textarea text size and padding: `sm`, `md` or `lg`. Default `md`. */
  size = input<TextareaSize>('md');
  /** Visual style: `outline`, `filled` or `ghost`. Default `outline`. */
  variant = input<TextareaVariant>('outline');
  /** Whether the user can resize the textarea: `none`, `vertical` or `both`. Default `vertical`. */
  resize = input<TextareaResize>('vertical');
  /** Shows the failed-validation style and sets `data-invalid`. Does not set `aria-invalid`. */
  invalid = input(false, { transform: booleanAttribute });
}
