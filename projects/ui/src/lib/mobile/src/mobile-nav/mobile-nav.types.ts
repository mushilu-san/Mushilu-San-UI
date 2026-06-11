import type { InjectionToken } from '@angular/core';

export interface MobileNavContext {
  activeItem: import('@angular/core').Signal<string>;
  setActive: (value: string) => void;
}

// Exported as value so the token can be imported by MobileNavItem
export declare const MOBILE_NAV_CONTEXT: InjectionToken<MobileNavContext>;
