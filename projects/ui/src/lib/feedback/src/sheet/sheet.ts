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
import type { SheetSide, SheetSize } from './sheet.types';

let sheetUid = 0;

/**
 * Sheet — a side-sliding panel that slides in from any edge.
 * Built on the native `<dialog>` element for correct focus-trap + backdrop.
 *
 * Usage:
 *   <mui-sheet [(open)]="open" side="right" heading="Settings">
 *     …content…
 *   </mui-sheet>
 */
@Component({
  selector: 'mui-sheet',
  standalone: true,
  templateUrl: './sheet.html',
  styleUrl: './sheet.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: { '[attr.part]': '"root"' },
})
export class Sheet {
  open = model(false);
  side = input<SheetSide>('right');
  size = input<SheetSize>('md');
  heading = input<string>();
  closeOnBackdrop = input(true, { transform: booleanAttribute });
  closeOnEscape = input(true, { transform: booleanAttribute });
  showClose = input(true, { transform: booleanAttribute });

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
