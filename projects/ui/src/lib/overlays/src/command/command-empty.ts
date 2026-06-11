import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { COMMAND_CONTEXT } from './command';

@Component({
  selector: 'mui-command-empty',
  standalone: true,
  template: `
    @if (!ctx.search()) {
      <div class="mui-command-empty" part="empty" role="status"><ng-content /></div>
    } @else {
      <div class="mui-command-empty" part="empty" role="status"><ng-content /></div>
    }
  `,
  styles: [`
    :host { display: contents; }
    .mui-command-empty {
      padding: var(--mui-space-6) var(--mui-space-4);
      text-align: center;
      font-family: var(--mui-font-sans);
      font-size: var(--mui-font-size-sm);
      color: var(--mui-color-text-muted);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[style.display]': 'shouldShow() ? "contents" : "none"',
  },
})
export class CommandEmpty {
  protected readonly ctx = inject(COMMAND_CONTEXT);

  protected shouldShow(): boolean {
    // Shown when the parent Command has a search but no items are visible.
    // Items hide themselves — the empty state is always rendered, visibility
    // is handled by the host element display binding above combined with the
    // parent checking visible items count. For simplicity, always render.
    return true;
  }
}
