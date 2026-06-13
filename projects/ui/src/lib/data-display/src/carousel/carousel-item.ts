import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  signal,
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
    '[attr.part]': '"item"',
  },
})
export class CarouselItem implements OnInit {
  private readonly ctx = inject(CAROUSEL_CONTEXT);
  private readonly _idx = signal(-1);

  protected readonly isActive = computed(() => this.ctx.active() === this._idx());
  protected readonly ariaLabel = computed(() => `Slide ${this._idx() + 1} of ${this.ctx.count()}`);

  ngOnInit(): void {
    this._idx.set(this.ctx.registerItem());
  }
}
