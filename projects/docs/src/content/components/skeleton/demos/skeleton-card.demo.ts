import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from '@mushilu-san/ui/feedback';

@Component({
  selector: 'docs-skeleton-card-demo',
  imports: [Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    aria-busy="true"
    style="display: grid; gap: var(--mui-space-3); max-width: 360px;"
  >
    <mui-skeleton variant="circle" width="48px" height="48px" />
    <mui-skeleton variant="text" [lines]="3" />
    <mui-skeleton variant="rect" height="120px" />
  </div>`,
})
export class SkeletonCardDemo {}
