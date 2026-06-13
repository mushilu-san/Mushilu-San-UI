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
import type { DialogSize } from './dialog.types';

let dialogUid = 0;

@Component({
  selector: 'mui-dialog',
  standalone: true,
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"root"',
  },
})
export class Dialog {
  /** Two-way open state. */
  open = model(false);
  /** Bold heading; wires up aria-labelledby when present. */
  heading = input<string>();
  size = input<DialogSize>('md');
  closeOnBackdrop = input(true, { transform: booleanAttribute });
  closeOnEscape = input(true, { transform: booleanAttribute });

  readonly opened = output<void>();
  readonly closed = output<void>();

  protected readonly headingId = `mui-dialog-title-${dialogUid++}`;

  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private wasOpen = false;

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const el = this.dialogRef()?.nativeElement;
      // View not ready yet — wait for the query to resolve (keep wasOpen).
      if (!el) {
        return;
      }
      if (isOpen && !this.wasOpen) {
        this.showNative(el);
        this.opened.emit();
      } else if (!isOpen && this.wasOpen) {
        if (el.open) {
          this.closeNative(el);
        }
        this.closed.emit();
      }
      this.wasOpen = isOpen;
    });
  }

  /** Native <dialog> fires `close` on Escape and on programmatic close — sync state. */
  protected onNativeClose(): void {
    if (this.open()) {
      this.open.set(false);
    }
  }

  /** Native <dialog> fires `cancel` on Escape before closing. */
  protected onCancel(event: Event): void {
    if (!this.closeOnEscape()) {
      event.preventDefault();
    }
  }

  /** A click directly on the <dialog> element is a backdrop click. */
  protected onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop() && event.target === this.dialogRef()?.nativeElement) {
      this.open.set(false);
    }
  }

  close(): void {
    this.open.set(false);
  }

  // jsdom (and very old browsers) lack working showModal/close — fall back to
  // toggling the `open` attribute so the component stays testable.
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
