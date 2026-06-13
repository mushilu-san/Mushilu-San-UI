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
  size = input<TextareaSize>('md');
  variant = input<TextareaVariant>('outline');
  resize = input<TextareaResize>('vertical');
  invalid = input(false, { transform: booleanAttribute });
}
