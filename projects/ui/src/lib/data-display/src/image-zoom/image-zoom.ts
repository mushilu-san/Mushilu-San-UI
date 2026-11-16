import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  input,
  viewChild,
} from '@angular/core';

/**
 * ImageZoom — a thumbnail button that opens the image enlarged in a modal dialog.
 * Built on the native `<dialog>`: focus is trapped, Escape closes and focus returns to the trigger.
 */
@Component({
  selector: 'mui-image-zoom',
  standalone: true,
  templateUrl: './image-zoom.html',
  styleUrl: './image-zoom.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"root"',
  },
})
export class ImageZoom {
  /** Thumbnail image URL. */
  src = input.required<string>();
  /** Alternative text (also names the dialog). */
  alt = input.required<string>();
  /** Optional higher-resolution URL for the enlarged view; defaults to `src`. */
  fullSrc = input<string | undefined>(undefined);
  /** Optional caption shown under the enlarged image. */
  caption = input<string | undefined>(undefined);
  /** Trigger label prefix (translate it). */
  enlargeLabel = input<string>('Enlarge image');
  /** Close button label (translate it). */
  closeLabel = input<string>('Close');

  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected open(): void {
    this.dialogRef().nativeElement.showModal();
  }

  protected close(): void {
    this.dialogRef().nativeElement.close();
  }

  /** Pressing the backdrop (the dialog element itself) closes; keyboard users have Escape it. */
  protected onDialogPointerdown(event: PointerEvent): void {
    if (event.target === event.currentTarget) this.close();
  }
}
