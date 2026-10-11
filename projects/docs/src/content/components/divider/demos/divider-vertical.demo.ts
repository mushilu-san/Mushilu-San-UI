import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Divider } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-divider-vertical-demo',
  imports: [Divider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div style="display: flex; align-items: stretch; gap: 12px; min-height: 24px;">
    <span>Edit</span>
    <mui-divider orientation="vertical" />
    <span>Share</span>
    <mui-divider orientation="vertical" variant="dashed" />
    <span>Delete</span>
  </div>`,
})
export class DividerVerticalDemo {}
