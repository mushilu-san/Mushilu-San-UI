import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  Signal,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';
import type { InputGroupSize } from './input-group.types';

export interface InputGroupContext {
  readonly invalid: Signal<boolean>;
}

export const INPUT_GROUP_CONTEXT = new InjectionToken<InputGroupContext>('INPUT_GROUP_CONTEXT');

@Component({
  selector: 'mui-input-group',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './input-group.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: INPUT_GROUP_CONTEXT,
      useFactory: (self: InputGroup) => ({ invalid: self.invalid }),
      deps: [InputGroup],
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-invalid]': 'invalid() || null',
    '[attr.part]': '"root"',
  },
})
export class InputGroup {
  size = input<InputGroupSize>('md');
  invalid = input(false, { transform: booleanAttribute });
}
