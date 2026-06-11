import { InjectionToken, Signal } from '@angular/core';

export interface CarouselContext {
  readonly active: Signal<number>;
  readonly count: Signal<number>;
  registerItem(): number;
  next(): void;
  prev(): void;
  goTo(idx: number): void;
}

export const CAROUSEL_CONTEXT = new InjectionToken<CarouselContext>('CAROUSEL_CONTEXT');
