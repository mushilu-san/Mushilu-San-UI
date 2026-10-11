import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Input, Label } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-label-required-demo',
  imports: [Input, Label],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-label for="full-name" [required]="true">Full name</mui-label>
    <input muiInput id="full-name" required />
    <mui-label for="nickname" [disabled]="true">Nickname (disabled)</mui-label>
    <input muiInput id="nickname" disabled />`,
})
export class LabelRequiredDemo {}
