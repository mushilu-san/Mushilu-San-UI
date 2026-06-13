import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { TOGGLE_GROUP_CONTEXT } from './toggle-group';

/**
 * ToggleGroupItem — a single button inside a ToggleGroup.
 *
 * Usage:
 *   <mui-toggle-group-item value="bold">Bold</mui-toggle-group-item>
 */
@Component({
  selector: 'mui-toggle-group-item',
  standalone: true,
  template: `
    <button
      type="button"
      class="mui-toggle-group-item__btn"
      part="button"
      [attr.aria-pressed]="isSelected()"
      [attr.aria-disabled]="isDisabled() || null"
      [attr.data-selected]="isSelected() ? '' : null"
      [attr.data-size]="ctx.size()"
      [attr.data-variant]="ctx.variant()"
      [attr.tabindex]="isDisabled() ? -1 : 0"
      (click)="onSelect()"
      (keydown.space)="$event.preventDefault(); onSelect()"
      (keydown.enter)="$event.preventDefault(); onSelect()"
    >
      <ng-content />
    </button>
  `,
  styleUrl: './toggle-group-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: { '[attr.part]': '"root"' },
})
export class ToggleGroupItem {
  value = input.required<string>();
  disabled = input(false, { transform: booleanAttribute });

  protected readonly ctx = inject(TOGGLE_GROUP_CONTEXT);

  protected readonly isSelected = computed(() => this.ctx.isSelected(this.value()));
  protected readonly isDisabled = computed(() => this.disabled() || this.ctx.disabled());

  protected onSelect(): void {
    if (this.isDisabled()) return;
    this.ctx.select(this.value());
  }
}
