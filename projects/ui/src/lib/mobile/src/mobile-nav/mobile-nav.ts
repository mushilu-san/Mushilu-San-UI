import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  ViewEncapsulation,
  model,
} from '@angular/core';

export interface MobileNavContext {
  activeItem: import('@angular/core').Signal<string>;
  setActive: (value: string) => void;
}

export const MOBILE_NAV_CONTEXT = new InjectionToken<MobileNavContext>('MOBILE_NAV_CONTEXT');

/**
 * Bottom navigation bar — a fixed bar at the bottom of the viewport
 * with 3–5 destination items.
 *
 * Usage:
 *   <mui-mobile-nav [(activeItem)]="activeTab">
 *     <mui-mobile-nav-item value="home" label="Home">…icon…</mui-mobile-nav-item>
 *     <mui-mobile-nav-item value="search" label="Search">…icon…</mui-mobile-nav-item>
 *   </mui-mobile-nav>
 */
@Component({
  selector: 'mui-mobile-nav',
  standalone: true,
  template: `
    <nav class="mui-mobile-nav__bar" part="bar" aria-label="Main navigation">
      <ng-content />
    </nav>
  `,
  styleUrl: './mobile-nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.part]': '"root"',
    role: 'none',
  },
  providers: [
    {
      provide: MOBILE_NAV_CONTEXT,
      useFactory: (self: MobileNav): MobileNavContext => ({
        activeItem: self.activeItem.asReadonly ? self.activeItem.asReadonly() : self.activeItem,
        setActive: (v: string) => self.activeItem.set(v),
      }),
      deps: [MobileNav],
    },
  ],
})
export class MobileNav {
  /** Two-way binding for the currently active item value. */
  activeItem = model<string>('');
}
