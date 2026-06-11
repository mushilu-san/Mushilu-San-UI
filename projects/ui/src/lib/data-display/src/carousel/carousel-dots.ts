import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { CAROUSEL_CONTEXT } from './carousel-context';

@Component({
  selector: 'mui-carousel-dots',
  standalone: true,
  templateUrl: './carousel-dots.html',
  styleUrl: './carousel-dots.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    'role':        'tablist',
    '[attr.part]': '"dots"',
    '[attr.aria-label]': '"Slide navigation"',
  },
})
export class CarouselDots {
  private readonly ctx = inject(CAROUSEL_CONTEXT);

  protected readonly dots = computed(() =>
    Array.from({ length: this.ctx.count() }, (_, i) => i),
  );
  protected readonly active = computed(() => this.ctx.active());

  protected select(idx: number): void {
    this.ctx.goTo(idx);
  }
}
