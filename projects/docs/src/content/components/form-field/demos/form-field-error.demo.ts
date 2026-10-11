import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormField, Input } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-form-field-error-demo',
  imports: [FormField, Input],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-form-field
    label="Password"
    controlId="password"
    hint="8 characters or more."
    error="Password must be at least 8 characters."
    [required]="true"
  >
    <input muiInput id="password" type="password" minlength="8" autocomplete="new-password" />
  </mui-form-field>`,
})
export class FormFieldErrorDemo {}
