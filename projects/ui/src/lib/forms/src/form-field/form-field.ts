import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';

let _fieldId = 0;

@Component({
  selector: 'mui-form-field',
  standalone: true,
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-invalid]': 'error() ? "" : null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.part]': '"root"',
  },
})
export class FormField {
  label = input<string>();
  hint = input<string>();
  error = input<string>();
  required = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  /** Pass the id of the control inside so the label `for` wires correctly. */
  controlId = input<string>('');

  protected readonly hintId = `mui-field-hint-${++_fieldId}`;
  protected readonly errorId = `mui-field-error-${_fieldId}`;
}
