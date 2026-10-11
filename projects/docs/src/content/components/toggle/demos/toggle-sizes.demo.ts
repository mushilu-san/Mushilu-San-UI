import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Toggle } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-toggle-sizes-demo',
  imports: [Toggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-toggle size="sm" label="Small" />
    <mui-toggle size="md" label="Medium" />
    <mui-toggle size="lg" label="Large" />
    <mui-toggle label="Disabled" [disabled]="true" />`,
})
export class ToggleSizesDemo {}
