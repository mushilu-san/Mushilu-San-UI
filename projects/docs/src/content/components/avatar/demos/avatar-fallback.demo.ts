import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-avatar-fallback-demo',
  imports: [Avatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-avatar name="Dana Levi" /> <mui-avatar name="Noa Cohen" />`,
})
export class AvatarFallbackDemo {}
