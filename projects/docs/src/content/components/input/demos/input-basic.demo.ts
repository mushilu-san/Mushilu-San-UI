import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormField, Input } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-input-basic-demo',
  imports: [FormField, Input],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-form-field
    label="Work email"
    controlId="work-email"
    hint="We will send the invoice here."
  >
    <input muiInput id="work-email" type="email" autocomplete="email" />
  </mui-form-field>`,
})
export class InputBasicDemo {}
