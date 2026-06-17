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

let alertDialogUid = 0;

/**
 * AlertDialog — a blocking confirmation modal that prevents backdrop-click dismissal.
 * Focus moves to the cancel / safe button on open (per ARIA best practice for
 * destructive confirmations).
 *
 * Usage:
 *   <mui-alert-dialog [(open)]="isOpen" heading="Delete item?"
 *                     confirmLabel="Delete" cancelLabel="Cancel"
 *                     (confirmed)="onDelete()" (cancelled)="isOpen=false">
 *     This action cannot be undone.
 *   </mui-alert-dialog>
 */
@Component({
  selector: 'mui-alert-dialog',
  standalone: true,
  templateUrl: './alert-dialog.html',
  styleUrl: './alert-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: { '[attr.part]': '"root"' },
})
export class AlertDialog {
  open = model(false);
  heading = input.required<string>();
  confirmLabel = input('Confirm');
  cancelLabel = input('Cancel');
  /** Set to true for destructive actions — styles confirm button in danger color. */
  destructive = input(false, { transform: booleanAttribute });

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected readonly titleId = `mui-alert-title-${alertDialogUid++}`;
  protected readonly descId = `mui-alert-desc-${alertDialogUid}`;

  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private readonly cancelRef = viewChild<ElementRef<HTMLButtonElement>>('cancelBtn');
  private wasOpen = false;

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const el = this.dialogRef()?.nativeElement;
      if (!el) return;

      if (isOpen && !this.wasOpen) {
        try {
          el.showModal();
        } catch {
          el.setAttribute('open', '');
        }
        // Focus cancel button (safe default for destructive confirmations)
        setTimeout(() => this.cancelRef()?.nativeElement?.focus(), 0);
      } else if (!isOpen && this.wasOpen) {
        try {
          el.close();
        } catch {
          el.removeAttribute('open');
        }
      }
      this.wasOpen = isOpen;
    });
  }

  protected onNativeClose(): void {
    if (this.open()) this.open.set(false);
  }

  /** Escape is intentionally prevented — AlertDialog must be explicitly dismissed. */
  protected onCancel(event: Event): void {
    event.preventDefault();
  }

  protected confirm(): void {
    this.open.set(false);
    this.confirmed.emit();
  }

  protected cancel(): void {
    this.open.set(false);
    this.cancelled.emit();
  }
}
