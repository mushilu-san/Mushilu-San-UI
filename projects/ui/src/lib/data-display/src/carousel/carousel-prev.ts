import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { CAROUSEL_CONTEXT } from './carousel-context';

@Component({
  selector: 'button[muiCarouselPrev]',
  standalone: true,
  templateUrl: './carousel-prev.html',
  styleUrl: './carousel-nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    'type':                'button',
    'aria-label':          'Previous slide',
    '[attr.part]':         '"prev"',
    '[attr.aria-disabled]': 'isDisabled()',
    '(click)':             'ctx.prev()',
  },
})
export class CarouselPrev {
  protected readonly ctx        = inject(CAROUSEL_CONTEXT);
  protected readonly isDisabled = computed(
    () => this.ctx.active() === 0,
  );
}
