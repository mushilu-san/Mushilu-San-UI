import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-select-variants-demo',
  imports: [Select],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<select muiSelect size="sm" aria-label="Small select">
      <option>Small</option>
    </select>
    <select muiSelect size="md" aria-label="Medium select">
      <option>Medium</option>
    </select>
    <select muiSelect variant="filled" aria-label="Filled select">
      <option>Filled</option>
    </select>
    <select muiSelect variant="ghost" aria-label="Ghost select">
      <option>Ghost</option>
    </select>`,
})
export class SelectVariantsDemo {}
