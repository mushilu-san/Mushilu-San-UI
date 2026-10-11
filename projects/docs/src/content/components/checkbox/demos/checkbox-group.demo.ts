import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Checkbox } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-checkbox-group-demo',
  imports: [Checkbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<fieldset>
    <legend>Notify me about</legend>
    <label><input type="checkbox" muiCheckbox checked /> New comments</label>
    <label><input type="checkbox" muiCheckbox /> Mentions</label>
    <label><input type="checkbox" muiCheckbox /> Weekly summary</label>
  </fieldset>`,
})
export class CheckboxGroupDemo {}
