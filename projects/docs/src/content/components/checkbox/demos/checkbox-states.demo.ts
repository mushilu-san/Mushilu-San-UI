import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Checkbox } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-checkbox-states-demo',
  imports: [Checkbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<label><input type="checkbox" muiCheckbox size="sm" /> Small</label>
    <label><input type="checkbox" muiCheckbox size="md" /> Medium</label>
    <label><input type="checkbox" muiCheckbox size="lg" /> Large</label>
    <label><input type="checkbox" muiCheckbox invalid /> I accept the terms (required)</label>`,
})
export class CheckboxStatesDemo {}
