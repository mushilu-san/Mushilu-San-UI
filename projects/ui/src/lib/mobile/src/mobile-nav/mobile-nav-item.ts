import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { MOBILE_NAV_CONTEXT } from './mobile-nav';

/**
 * An individual destination tab inside `<mui-mobile-nav>`.
 *
 * Usage:
 *   <mui-mobile-nav-item value="home" label="Home">
 *     <svg …/>
 *   </mui-mobile-nav-item>
 */
@Component({
  selector: 'mui-mobile-nav-item',
  standalone: true,
  templateUrl: './mobile-nav-item.html',
  styleUrl: './mobile-nav-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"item"',
  },
})
export class MobileNavItem {
  /** Unique value identifying this destination. */
  value = input.required<string>();
  /** Visible label text shown beneath the icon. */
  label = input.required<string>();
  /** Optional badge count. A value > 0 shows a numeric badge; -1 shows a dot badge. */
  badge = input<number, number>(0, { transform: numberAttribute });

  protected readonly ctx = inject(MOBILE_NAV_CONTEXT);
  protected readonly isActive = computed(() => this.ctx.activeItem() === this.value());
  protected readonly badgeLabel = computed(() => {
    const b = this.badge();
    if (b < 0) return '•';
    if (b > 99) return '99+';
    return b > 0 ? String(b) : null;
  });

  @HostListener('click')
  protected select(): void {
    this.ctx.setActive(this.value());
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  protected onKey(event: Event): void {
    event.preventDefault();
    this.ctx.setActive(this.value());
  }
}
