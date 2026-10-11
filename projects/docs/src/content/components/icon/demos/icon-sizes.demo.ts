import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-icon-sizes-demo',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-icon name="star" size="xs" />
    <mui-icon name="star" size="sm" />
    <mui-icon name="star" size="md" />
    <mui-icon name="star" size="lg" />
    <mui-icon name="star" size="xl" />
    <mui-icon name="heart" color="danger" />
    <mui-icon name="check-circle" color="success" />
    <mui-icon name="info" color="primary" />`,
})
export class IconSizesDemo {}
