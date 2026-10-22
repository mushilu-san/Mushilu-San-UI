import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { CAROUSEL_CONTEXT } from './carousel-context';

@Component({
  selector: 'mui-carousel-item',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './carousel-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    role: 'group',
    '[attr.aria-roledescription]': '"slide"',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.data-active]': 'isActive() ? "" : null',
    '[attr.aria-hidden]': '!isActive()',
    // inert removes inactive slides' focusable content from the tab order (H-A-b028b8).
    '[attr.inert]': 'isActive() ? null : ""',
    '[attr.part]': '"item"',
  },
})
export class CarouselItem implements OnInit, OnDestroy {
  private readonly ctx = inject(CAROUSEL_CONTEXT);
  private readonly _idx = computed(() => this.ctx.indexOf(this));

  protected readonly isActive = computed(() => this.ctx.active() === this._idx());
  protected readonly ariaLabel = computed(() => `Slide ${this._idx() + 1} of ${this.ctx.count()}`);

  ngOnInit(): void {
    this.ctx.registerItem(this);
  }

  ngOnDestroy(): void {
    this.ctx.unregisterItem(this);
  }
}
