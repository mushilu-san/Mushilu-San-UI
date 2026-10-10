import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Stack } from '@mushilu-san/ui/layout';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-button-loading-demo',
  imports: [Button, Stack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mui-stack direction="row" align="center" [gap]="3" wrap>
      <button muiButton [loading]="saving()" (clicked)="save()">
        {{ saving() ? 'Saving…' : 'Save' }}
      </button>
      <button muiButton variant="secondary" disabled>Disabled</button>
    </mui-stack>
  `,
})
export class ButtonLoadingDemo {
  protected readonly saving = signal(false);

  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected save(): void {
    this.saving.set(true);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.saving.set(false), 1500);
  }
}
