import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-avatar-sizes-demo',
  imports: [Avatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-avatar name="Dana Levi" size="xs" />
    <mui-avatar name="Dana Levi" size="sm" />
    <mui-avatar name="Dana Levi" size="md" />
    <mui-avatar name="Dana Levi" size="lg" />
    <mui-avatar name="Dana Levi" size="xl" />
    <mui-avatar name="Mushilu San" shape="square" size="lg" />`,
})
export class AvatarSizesDemo {}
