import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';
import type { CardVariant } from './card.types';

@Component({
  selector: 'mui-card',
  standalone: true,
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-clickable]': 'isButton() ? "" : null',
    '[attr.part]': '"root"',
    '[attr.data-link]': 'href() ? "" : null',
    '[attr.tabindex]': 'isButton() ? "0" : null',
    '[attr.role]': 'isButton() ? "button" : null',
  },
})
export class Card {
  /** Visual style variant. */
  variant = input<CardVariant>('flat');
  /** When true, the card is keyboard-activatable and emits `clicked`. */
  clickable = input(false, { transform: booleanAttribute });

  /**
   * Link mode: renders a real anchor stretched over the whole card. Takes precedence over
   * `clickable`. Nested interactive content must sit above it (`position: relative; z-index: 1`).
   */
  href = input<string | undefined>(undefined);
  /** Accessible name of the link (`aria-label`). Required for a meaningful link in link mode. */
  linkLabel = input<string | undefined>(undefined);
  /** Anchor `target` in link mode. */
  target = input<string | undefined>(undefined);
  /** Anchor `rel` in link mode. */
  rel = input<string | undefined>(undefined);

  protected readonly isButton = computed(() => this.clickable() && !this.href());

  /** Emitted when a clickable card is activated (click, Enter, Space), or the link-mode anchor is clicked (lets SPA apps route instead of navigating). */
  readonly clicked = output<void>();

  @HostListener('click')
  protected onClick(): void {
    if (this.isButton()) this.clicked.emit();
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (!this.isButton()) return;
    if (event.key === 'Enter') {
      this.clicked.emit();
    } else if (event.key === ' ') {
      event.preventDefault(); // prevent page scroll
      this.clicked.emit();
    }
  }
}
