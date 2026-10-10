import { Component, booleanAttribute, input, model, output } from '@angular/core';
import type { FixtureSize } from './fixture.types';

@Component({
  selector: 'mui-fixture-card',
  templateUrl: './fixture-card.html',
  host: { '[attr.part]': '"root"' },
})
export class FixtureCard {
  /** Visual size of the card. */
  size = input<FixtureSize>('md');
  /** Whether the card is disabled. */
  disabled = input(false, { transform: booleanAttribute });
  heading = input<string>();
  /** Unique key. */
  key = input.required<string>();
  /** @deprecated Use `size` instead. */
  compact = input(false, { alias: 'dense', transform: booleanAttribute });
  /** Open state. */
  open = model(false);
  /** Emits on press. */
  readonly pressed = output<MouseEvent>();
  protected readonly internal = 1;
}
