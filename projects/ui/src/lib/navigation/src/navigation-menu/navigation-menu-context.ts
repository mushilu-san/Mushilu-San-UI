import { InjectionToken, Signal } from '@angular/core';

export interface NavMenuContext {
  readonly openId: Signal<string | null>;
  setOpen(id: string | null): void;
}

export interface NavMenuItemContext {
  readonly id: string;
  readonly isOpen: Signal<boolean>;
  toggle(): void;
}

export const NAV_MENU_CONTEXT      = new InjectionToken<NavMenuContext>('NAV_MENU_CONTEXT');
export const NAV_MENU_ITEM_CONTEXT = new InjectionToken<NavMenuItemContext>('NAV_MENU_ITEM_CONTEXT');
