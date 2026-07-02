import { InjectionToken, Signal } from '@angular/core';

export interface ResizablePanelRegistration {
  idx: number;
  size: Signal<number>;
}

export interface ResizableGroupContext {
  readonly direction: Signal<'horizontal' | 'vertical'>;
  registerPanel(defaultSize: number, minSize: number, maxSize: number): ResizablePanelRegistration;
  unregisterPanel(registration: ResizablePanelRegistration): void;
  startResize(event: PointerEvent, handleEl: HTMLElement): void;
  resizeByPercent(handleEl: HTMLElement, deltaPct: number): void;
}

export const RESIZABLE_GROUP_CONTEXT = new InjectionToken<ResizableGroupContext>(
  'RESIZABLE_GROUP_CONTEXT',
);
