import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';
import { FORM_FIELD_CONTEXT } from './form-field-context';

let _fieldId = 0;

@Component({
  selector: 'mui-form-field',
  standalone: true,
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: FORM_FIELD_CONTEXT,
      useFactory: (self: FormField) => ({ describedBy: self.describedBy }),
      deps: [FormField],
    },
  ],
  host: {
    '[attr.data-invalid]': 'error() ? "" : null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.part]': '"root"',
  },
})
export class FormField {
  /** Visible label text, linked to the control through `controlId`. */
  label = input<string>();
  /** Helper text shown under the control, for format rules or guidance. */
  hint = input<string>();
  /** Error message shown under the control. Announced when it appears. */
  error = input<string>();
  /** Shows the required marker on the label. */
  required = input(false, { transform: booleanAttribute });
  /** Dims the label and hint to match a disabled control. */
  disabled = input(false, { transform: booleanAttribute });
  /** Pass the id of the control inside so the label `for` wires correctly. */
  controlId = input<string>('');

  protected readonly hintId = `mui-field-hint-${++_fieldId}`;
  protected readonly errorId = `mui-field-error-${_fieldId}`;

  /** @internal Id of the visible hint or error, linked to the control by `aria-describedby`. */
  readonly describedBy = computed(() =>
    this.error() ? this.errorId : this.hint() ? this.hintId : null,
  );
}
