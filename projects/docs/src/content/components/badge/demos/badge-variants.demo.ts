import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-badge-variants-demo',
  imports: [Badge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-badge>Default</mui-badge>
    <mui-badge variant="primary">Primary</mui-badge>
    <mui-badge variant="success">Active</mui-badge>
    <mui-badge variant="warning">Pending</mui-badge>
    <mui-badge variant="danger">Failed</mui-badge>
    <mui-badge variant="info">New</mui-badge>`,
})
export class BadgeVariantsDemo {}
