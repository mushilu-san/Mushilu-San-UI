import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormField, Select } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-select-basic-demo',
  imports: [FormField, Select],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-form-field label="Country" controlId="country">
    <select muiSelect id="country">
      <option value="" disabled selected>Choose a country</option>
      <option value="il">Israel</option>
      <option value="us">United States</option>
      <option value="fr">France</option>
    </select>
  </mui-form-field>`,
})
export class SelectBasicDemo {}
