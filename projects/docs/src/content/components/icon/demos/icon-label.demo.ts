import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-icon-label-demo',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-icon name="mail" label="Email" />
    <span>Next step</span>
    <mui-icon name="arrow-right" mirror />`,
})
export class IconLabelDemo {}
