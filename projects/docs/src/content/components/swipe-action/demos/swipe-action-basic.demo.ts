import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SwipeAction, type SwipeActionItem } from '@mushilu-san/ui/mobile';

@Component({
  selector: 'docs-swipe-action-basic-demo',
  imports: [SwipeAction],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div role="list">
      <mui-swipe-action [actions]="actions" (actionTriggered)="last.set($event)">
        <div style="padding: var(--mui-space-3);">Quarterly report</div>
      </mui-swipe-action>
    </div>
    <p>Last action: {{ last() }}</p>`,
})
export class SwipeActionBasicDemo {
  protected readonly last = signal('none');
  protected readonly actions: SwipeActionItem[] = [
    { key: 'archive', label: 'Archive', side: 'end', color: 'primary' },
    { key: 'delete', label: 'Delete', side: 'end', color: 'danger' },
  ];
}
