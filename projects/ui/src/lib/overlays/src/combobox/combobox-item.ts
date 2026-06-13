import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { COMBOBOX_CONTEXT } from './combobox';

@Component({
  selector: 'mui-combobox-item',
  standalone: true,
  template: `
    <button
      type="button"
      class="mui-combobox-item__btn"
      part="item"
      role="option"
      [attr.aria-selected]="isSelected()"
      [attr.aria-disabled]="disabled() || null"
      [attr.tabindex]="disabled() ? -1 : 0"
      (click)="onSelect()"
    >
      @if (isSelected()) {
        <svg
          class="mui-combobox-item__check"
          viewBox="0 0 16 16"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M2 8l4 4 8-8" />
        </svg>
      } @else {
        <span class="mui-combobox-item__check-placeholder"></span>
      }
      <ng-content />
    </button>
  `,
  styleUrl: './combobox-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[style.display]': 'isHidden() ? "none" : "contents"',
    '[attr.part]': '"item-root"',
  },
})
export class ComboboxItem {
  value = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });

  protected readonly ctx = inject(COMBOBOX_CONTEXT);

  protected readonly isSelected = computed(
    () => this.ctx.selectedLabel() === this.value() || (this.ctx.search() === '' && false),
  );
  protected readonly isHidden = computed(() => {
    const q = this.ctx.search().toLowerCase().trim();
    if (!q) return false;
    return !this.value().toLowerCase().includes(q);
  });

  protected onSelect(): void {
    if (this.disabled()) return;
    // Get label from the element's text content at runtime
    this.ctx.selectItem(this.value(), this.value());
  }
}
