import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Radio } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-radio-sizes-demo',
  imports: [Radio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<label><input type="radio" muiRadio name="size-demo" size="sm" /> Small</label>
    <label><input type="radio" muiRadio name="size-demo" size="md" /> Medium</label>
    <label><input type="radio" muiRadio name="size-demo" size="lg" /> Large</label>`,
})
export class RadioSizesDemo {}
