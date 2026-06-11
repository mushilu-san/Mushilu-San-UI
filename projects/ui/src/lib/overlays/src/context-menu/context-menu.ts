import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  InjectionToken,
  Signal,
  ViewEncapsulation,
  input,
  model,
  output,
  signal,
} from '@angular/core';

export interface ContextMenuContext {
  readonly open: Signal<boolean>;
  openAt(x: number, y: number): void;
  close(): void;
  onItemSelected(): void;
}

export const CONTEXT_MENU_CONTEXT = new InjectionToken<ContextMenuContext>(
  'CONTEXT_MENU_CONTEXT',
);

/**
 * ContextMenu — opens at the cursor position on right-click or long-press.
 *
 * Usage:
 *   <mui-context-menu>
 *     <div muiContextMenuTrigger>Right-click me</div>
 *     <mui-context-menu-item>Edit</mui-context-menu-item>
 *     <mui-context-menu-separator />
 *     <mui-context-menu-item color="danger">Delete</mui-context-menu-item>
 *   </mui-context-menu>
 */
@Component({
  selector: 'mui-context-menu',
  standalone: true,
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: CONTEXT_MENU_CONTEXT,
      useFactory: (self: ContextMenu) => ({
        open:           self.open,
        openAt:         (x: number, y: number) => self.openAt(x, y),
        close:          () => self.close(),
        onItemSelected: () => self.close(),
      }),
      deps: [ContextMenu],
    },
  ],
  host: {
    '[attr.part]': '"root"',
    '[style.--ctx-x.px]': 'panelX()',
    '[style.--ctx-y.px]': 'panelY()',
  },
})
export class ContextMenu {
  open    = model(false);
  closeOnSelect = input(true);

  readonly opened = output<void>();
  readonly closed = output<void>();

  protected readonly panelX = signal(0);
  protected readonly panelY = signal(0);

  openAt(clientX: number, clientY: number): void {
    this.panelX.set(clientX);
    this.panelY.set(clientY);
    this.open.set(true);
    this.opened.emit();
  }

  close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.closed.emit();
  }

  @HostListener('document:click')
  protected onDocumentClick(): void {
    if (this.open()) this.close();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) this.close();
  }
}
