import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-badge-dot-demo',
  imports: [Badge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-badge variant="success" dot label="Online" />
    <mui-badge variant="warning" dot label="Away" />
    <mui-badge variant="danger" dot label="Offline" />`,
})
export class BadgeDotDemo {}
