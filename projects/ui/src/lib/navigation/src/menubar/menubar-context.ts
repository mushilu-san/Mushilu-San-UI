import { InjectionToken, Signal } from '@angular/core';

export interface MenubarContext {
  readonly openId: Signal<string | null>;
  setOpen(id: string | null): void;
}

export interface MenubarMenuContext {
  readonly id: string;
  readonly isOpen: Signal<boolean>;
  toggle(): void;
}

export const MENUBAR_CONTEXT      = new InjectionToken<MenubarContext>('MENUBAR_CONTEXT');
export const MENUBAR_MENU_CONTEXT = new InjectionToken<MenubarMenuContext>('MENUBAR_MENU_CONTEXT');
