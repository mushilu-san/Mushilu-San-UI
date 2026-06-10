import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
  booleanAttribute,
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
    '[attr.data-variant]':  'variant()',
    '[attr.data-clickable]': 'clickable() ? "" : null',
    '[attr.part]':           '"root"',
    '[attr.tabindex]':       'clickable() ? "0" : null',
    '[attr.role]':           'clickable() ? "button" : null',
  },
})
export class Card {
  /** Visual style variant. */
  variant = input<CardVariant>('flat');
  /** When true, the card is keyboard-activatable and emits `clicked`. */
  clickable = input(false, { transform: booleanAttribute });

  /** Emitted when a clickable card is activated (click, Enter, Space). */
  readonly clicked = output<void>();

  @HostListener('click')
  protected onClick(): void {
    if (this.clickable()) this.clicked.emit();
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (!this.clickable()) return;
    if (event.key === 'Enter') {
      this.clicked.emit();
    } else if (event.key === ' ') {
      event.preventDefault(); // prevent page scroll
      this.clicked.emit();
    }
  }
}
