import {
  ChangeDetectionStrategy,
  DestroyRef,
  Component,
  DOCUMENT,
  ViewEncapsulation,
  inject,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';

/**
 * CopyButton — copies text to the clipboard and announces "copied" to assistive tech.
 *
 * Give it `text`, or a `source` element whose text is read at click time (works with
 * imperative or non-Angular HTML such as a rendered code block).
 */
@Component({
  selector: 'mui-copy-button',
  standalone: true,
  templateUrl: './copy-button.html',
  styleUrl: './copy-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"root"',
    '[attr.data-copied]': 'copied() ? "" : null',
  },
})
export class CopyButton {
  private readonly doc = inject(DOCUMENT);
  private timer: ReturnType<typeof setTimeout> | undefined;

  /** Text to copy. Ignored when `source` is set. */
  text = input<string>('');
  /** Element whose `textContent` is copied at click time. */
  source = input<HTMLElement | null | undefined>(undefined);
  /** Button label (translate it). */
  label = input<string>('Copy');
  /** Label and live announcement shown after copying (translate it). */
  copiedLabel = input<string>('Copied');
  /** Milliseconds before the button returns to its idle state. */
  resetDelay = input(2000, { transform: numberAttribute });

  /** Emitted with the copied text after a successful copy. */
  readonly copiedText = output<string>();
  /** Emitted when the clipboard write is rejected or unavailable. */
  readonly failed = output<void>();

  protected readonly copied = signal(false);

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected async copy(): Promise<void> {
    const value = this.source()?.textContent ?? this.text();
    try {
      const clipboard = this.doc.defaultView?.navigator.clipboard;
      if (!clipboard) throw new Error('Clipboard unavailable');
      await clipboard.writeText(value);
    } catch {
      this.failed.emit();
      return;
    }
    this.copied.set(true);
    this.copiedText.emit(value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.copied.set(false), this.resetDelay());
  }
}
