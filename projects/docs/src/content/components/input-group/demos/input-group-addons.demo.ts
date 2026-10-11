import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Input, InputGroup, InputGroupAddon } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-input-group-addons-demo',
  imports: [Input, InputGroup, InputGroupAddon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-input-group>
    <mui-input-group-addon>$</mui-input-group-addon>
    <input muiInput aria-label="Price in US dollars" placeholder="0.00" />
    <mui-input-group-addon>USD</mui-input-group-addon>
  </mui-input-group>`,
})
export class InputGroupAddonsDemo {}
