import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrev,
} from '@mushilu-san/ui/data-display';

@Component({
  selector: 'docs-carousel-basic-demo',
  imports: [Carousel, CarouselContent, CarouselItem, CarouselPrev, CarouselNext, CarouselDots],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-carousel [(active)]="active" [loop]="true" label="Featured rooms">
      <mui-carousel-content>
        <mui-carousel-item>Slide one: the living room.</mui-carousel-item>
        <mui-carousel-item>Slide two: the kitchen.</mui-carousel-item>
        <mui-carousel-item>Slide three: the garden.</mui-carousel-item>
      </mui-carousel-content>
      <button muiCarouselPrev aria-label="Previous slide">Previous</button>
      <button muiCarouselNext aria-label="Next slide">Next</button>
      <mui-carousel-dots />
    </mui-carousel>
    <p>Showing slide {{ active() + 1 }} of 3</p>`,
})
export class CarouselBasicDemo {
  protected readonly active = signal(0);
}
