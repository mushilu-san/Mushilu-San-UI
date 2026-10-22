import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  InjectionToken,
  Injector,
  Signal,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
  model,
  output,
  runInInjectionContext,
  signal,
  viewChild,
} from '@angular/core';
import { anchoredPanel, positionPanel } from '../positioning/anchored-panel';

export interface ContextMenuContext {
  readonly open: Signal<boolean>;
  openAt(x: number, y: number): void;
  close(): void;
  onItemSelected(): void;
}

export const CONTEXT_MENU_CONTEXT = new InjectionToken<ContextMenuContext>('CONTEXT_MENU_CONTEXT');

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
        open: self.open,
        openAt: (x: number, y: number) => self.openAt(x, y),
        close: () => self.close(),
        onItemSelected: () => self.close(),
      }),
      deps: [ContextMenu],
    },
  ],
  host: { '[attr.part]': '"root"' },
})
export class ContextMenu {
  /** Whether the menu is open. Two-way bindable with `[(open)]`. */
  open = model(false);
  /** Closes the menu after an item is chosen. Default `true`. */
  closeOnSelect = input(true, { transform: booleanAttribute });

  /** Emits when the menu opens. */
  readonly opened = output<void>();
  /** Emits when the menu closes, however it was closed. */
  readonly closed = output<void>();

  private readonly point = signal({ x: 0, y: 0 });

  private readonly doc = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panelEl');
  private _restoreFocusEl: HTMLElement | null = null;

  constructor() {
    // H-C-a640a4: shared computePosition (4px viewport clamp), re-run on scroll/resize.
    // The panel is position: fixed, so the cursor point is a zero-size anchor and the
    // menu opens down-and-inline-end of it (rtl: false keeps the cursor on its left edge).
    anchoredPanel({
      open: this.open,
      panel: () => this.panelRef()?.nativeElement,
      place: (panel) => {
        const { x, y } = this.point();
        const anchor = { left: x, top: y, right: x, bottom: y, width: 0, height: 0 } as DOMRect;
        positionPanel(panel, anchor, 'bottom-start', { rtl: false, gap: 0 });
      },
    });
  }

  openAt(clientX: number, clientY: number): void {
    this.point.set({ x: clientX, y: clientY });
    this.open.set(true);
    this.opened.emit();
    // H-E-648d10: focus must move into the menu panel once it renders — a
    // right-click opening the menu previously left focus wherever it was,
    // violating the WCAG requirement that opening a menu moves focus inside it.
    runInInjectionContext(this.injector, () => {
      afterNextRender(() => {
        const panel = this.panelRef();
        if (!panel) return;
        panel.nativeElement.focus();
      });
    });
  }

  /**
   * H-E-fd6a0a: tracks whatever was focused right before a pointer gesture,
   * so Escape can restore it later. Captured on pointerdown rather than in
   * openAt()/the contextmenu handler — by the time 'contextmenu' fires, the
   * browser's mousedown default action has already blurred the prior element.
   */
  @HostListener('document:pointerdown')
  protected onDocumentPointerDown(): void {
    if (!this.open()) {
      this._restoreFocusEl = this.doc.activeElement as HTMLElement | null;
    }
  }

  close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.closed.emit();
  }

  /**
   * H-E-fd6a0a: the panel stops keydown propagation so keystrokes don't leak
   * to the underlying page, but Escape must still reach onEscape() below —
   * without this carve-out, focusing a menu item made Escape a dead key.
   */
  protected onPanelKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      event.stopPropagation();
    }
  }

  @HostListener('document:click')
  protected onDocumentClick(): void {
    if (this.open()) this.close();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.close();
      // H-E-fd6a0a: display:none on close force-blurs any focused item, so
      // whatever had focus before the menu opened must be re-focused explicitly.
      this._restoreFocusEl?.focus();
    }
  }
}
