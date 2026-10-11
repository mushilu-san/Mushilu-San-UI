import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tooltip } from '@mushilu-san/ui/data-display';

@Component({
  selector: 'docs-tooltip-placement-demo',
  imports: [Tooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div style="display: flex; gap: var(--mui-space-3); flex-wrap: wrap;">
    <button muiButton variant="secondary" muiTooltip="Copy the link" placement="top">
      Copy link
    </button>
    <button muiButton variant="secondary" muiTooltip="Opens in a new tab" placement="bottom">
      Open
    </button>
  </div>`,
})
export class TooltipPlacementDemo {}
