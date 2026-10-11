import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Input } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-input-variants-demo',
  imports: [Input],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<input muiInput size="sm" placeholder="Small" aria-label="Small input" />
    <input muiInput size="md" placeholder="Medium (outline)" aria-label="Medium input" />
    <input muiInput variant="filled" placeholder="Filled" aria-label="Filled input" />
    <input muiInput variant="ghost" placeholder="Ghost" aria-label="Ghost input" />
    <input muiInput invalid value="not-an-email" aria-label="Invalid input" />`,
})
export class InputVariantsDemo {}
