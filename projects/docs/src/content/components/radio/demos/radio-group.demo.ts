import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Radio } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-radio-group-demo',
  imports: [Radio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<fieldset>
    <legend>Delivery method</legend>
    <label
      ><input type="radio" muiRadio name="delivery" value="standard" checked /> Standard (3–5
      days)</label
    >
    <label
      ><input type="radio" muiRadio name="delivery" value="express" /> Express (next day)</label
    >
    <label><input type="radio" muiRadio name="delivery" value="pickup" /> Pick up in store</label>
  </fieldset>`,
})
export class RadioGroupDemo {}
