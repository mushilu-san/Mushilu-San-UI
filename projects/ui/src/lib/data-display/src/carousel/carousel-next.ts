import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { CAROUSEL_CONTEXT } from './carousel-context';

@Component({
  selector: 'button[muiCarouselNext]',
  standalone: true,
  templateUrl: './carousel-next.html',
  styleUrl: './carousel-nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    'type':                 'button',
    'aria-label':           'Next slide',
    '[attr.part]':          '"next"',
    '[attr.aria-disabled]': 'isDisabled()',
    '(click)':              'ctx.next()',
  },
})
export class CarouselNext {
  protected readonly ctx        = inject(CAROUSEL_CONTEXT);
  protected readonly isDisabled = computed(
    () => this.ctx.active() === this.ctx.count() - 1,
  );
}
