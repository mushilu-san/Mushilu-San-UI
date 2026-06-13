import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  effect,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import type { BottomSheetSize } from './bottom-sheet.types';

let sheetUid = 0;

/**
 * BottomSheet — a modal panel that slides up from the bottom of the screen.
 * Uses the native `<dialog>` element for built-in focus trap, Escape dismissal,
 * and the `::backdrop` pseudo-element.
 *
 * Usage:
 *   <mui-bottom-sheet [(open)]="isOpen" heading="Options">
 *     <p>Sheet content here…</p>
 *     <button slot="footer" muiButton>Confirm</button>
 *   </mui-bottom-sheet>
 */
@Component({
  selector: 'mui-bottom-sheet',
  standalone: true,
  templateUrl: './bottom-sheet.html',
  styleUrl: './bottom-sheet.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"root"',
  },
})
export class BottomSheet {
  /** Two-way open state. */
  open = model(false);
  /** Optional heading — wires up aria-labelledby when present. */
  heading = input<string>();
  /** Sheet height preset. */
  size = input<BottomSheetSize>('md');
  /** Show the drag-handle affordance at the top of the sheet. */
  showHandle = input(true, { transform: booleanAttribute });
  closeOnBackdrop = input(true, { transform: booleanAttribute });
  closeOnEscape = input(true, { transform: booleanAttribute });

  readonly opened = output<void>();
  readonly closed = output<void>();

  protected readonly headingId = `mui-sheet-title-${sheetUid++}`;
  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private wasOpen = false;

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const el = this.dialogRef()?.nativeElement;
      if (!el) return;

      if (isOpen && !this.wasOpen) {
        this.showNative(el);
        this.opened.emit();
      } else if (!isOpen && this.wasOpen) {
        if (el.open) this.closeNative(el);
        this.closed.emit();
      }
      this.wasOpen = isOpen;
    });
  }

  protected onNativeClose(): void {
    if (this.open()) this.open.set(false);
  }

  protected onCancel(event: Event): void {
    if (!this.closeOnEscape()) event.preventDefault();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop() && event.target === this.dialogRef()?.nativeElement) {
      this.open.set(false);
    }
  }

  close(): void {
    this.open.set(false);
  }

  private showNative(el: HTMLDialogElement): void {
    try {
      el.showModal();
    } catch {
      el.setAttribute('open', '');
    }
  }

  private closeNative(el: HTMLDialogElement): void {
    try {
      el.close();
    } catch {
      el.removeAttribute('open');
    }
  }
}
