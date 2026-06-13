import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { COMMAND_CONTEXT } from './command';

@Component({
  selector: 'mui-command-item',
  standalone: true,
  template: `
    <button
      type="button"
      class="mui-command-item__btn"
      part="item"
      role="option"
      data-command-item
      [attr.aria-selected]="selected()"
      [attr.aria-disabled]="disabled() || null"
      [attr.tabindex]="disabled() ? -1 : 0"
      (click)="onActivate()"
      (keydown.enter)="$event.preventDefault(); onActivate()"
      (keydown.arrowDown)="$event.preventDefault(); ctx.focusNext()"
      (keydown.arrowUp)="$event.preventDefault(); ctx.focusPrev()"
    >
      <ng-content select="[slot=icon]" />
      <span class="mui-command-item__label"><ng-content /></span>
      @if (shortcut()) {
        <kbd class="mui-command-item__shortcut" aria-hidden="true">{{ shortcut() }}</kbd>
      }
    </button>
  `,
  styleUrl: './command-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[style.display]': 'isHidden() ? "none" : "contents"',
    '[attr.part]': '"item-root"',
  },
})
export class CommandItem {
  /** The searchable value for this item. Filters against ctx.search(). */
  value = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });
  selected = input(false, { transform: booleanAttribute });
  shortcut = input<string>();

  readonly activated = output<string>();

  protected readonly ctx = inject(COMMAND_CONTEXT);

  protected readonly isHidden = computed(() => {
    const q = this.ctx.search().toLowerCase().trim();
    if (!q) return false;
    return !this.value().toLowerCase().includes(q);
  });

  protected onActivate(): void {
    if (this.disabled()) return;
    this.activated.emit(this.value());
    this.ctx.onItemActivated(this.value(), this.value());
  }
}
