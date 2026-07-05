import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  InjectionToken,
  Injector,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
  model,
  output,
  runInInjectionContext,
  viewChild,
} from '@angular/core';
import type { PopoverPlacement } from './popover.types';

let popoverUid = 0;

export interface PopoverContext {
  open: ReturnType<typeof model<boolean>>;
  toggle: () => void;
  close: () => void;
}

export const POPOVER_CONTEXT = new InjectionToken<PopoverContext>('POPOVER_CONTEXT');

/**
 * Popover — a floating panel anchored to its trigger.
 * The trigger must have the `muiPopoverTrigger` directive applied.
 *
 * Usage:
 *   <mui-popover placement="bottom-start">
 *     <button muiPopoverTrigger>Open</button>
 *     <p>Popover content here.</p>
 *   </mui-popover>
 */
@Component({
  selector: 'mui-popover',
  standalone: true,
  templateUrl: './popover.html',
  styleUrl: './popover.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-open]': 'open() ? "" : null',
    '[attr.part]': '"root"',
  },
  providers: [
    {
      provide: POPOVER_CONTEXT,
      /* v8 ignore next 5 -- DI factory body; V8 misattributes coverage for object-literal factories */
      useFactory: (self: Popover): PopoverContext => ({
        open: self.open,
        toggle: () => self.toggle(),
        close: () => self.close(),
      }),
      deps: [Popover],
    },
  ],
})
export class Popover {
  /** Preferred placement of the panel relative to the trigger. */
  placement = input<PopoverPlacement>('bottom');
  /** Two-way open state. */
  open = model(false);
  /** Optional accessible heading inside the panel. */
  heading = input<string>();
  closeOnOutsideClick = input(true, { transform: booleanAttribute });
  closeOnEscape = input(true, { transform: booleanAttribute });

  readonly opened = output<void>();
  readonly closed = output<void>();

  protected readonly panelId = `mui-popover-panel-${popoverUid++}`;
  protected readonly headingId = `mui-popover-heading-${popoverUid}`;

  private readonly el = inject(ElementRef);
  private readonly injector = inject(Injector);
  private readonly doc = inject(DOCUMENT);
  private readonly panelEl = viewChild<ElementRef<HTMLElement>>('panelEl');
  private triggerEl: HTMLElement | null = null;

  toggle(): void {
    const next = !this.open();
    if (next) {
      this.triggerEl = this.doc.activeElement as HTMLElement | null;
    }
    this.open.set(next);
    if (next) {
      this.opened.emit();
      // H-E-3a3965: move focus into the panel once it has rendered — the panel is a
      // plain div (not <dialog>), so it gets no focus management for free.
      runInInjectionContext(this.injector, () => {
        afterNextRender(() => {
          const panel = this.panelEl();
          if (!panel) return;
          panel.nativeElement.focus();
        });
      });
    } else {
      this.closed.emit();
    }
  }

  close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.closed.emit();
    // H-E-3a3965: the panel (and any focus inside it) is removed from the DOM
    // via the @if, so focus must be restored to the trigger explicitly.
    const trigger = this.triggerEl;
    if (trigger) trigger.focus();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open() || !this.closeOnOutsideClick()) return;
    if (!(this.el.nativeElement as HTMLElement).contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open() && this.closeOnEscape()) this.close();
  }
}
