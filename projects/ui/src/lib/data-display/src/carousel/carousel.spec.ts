import { fireEvent } from '@testing-library/angular';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Carousel } from './carousel';
import { CarouselContent } from './carousel-content';
import { CarouselItem } from './carousel-item';
import { CarouselPrev } from './carousel-prev';
import { CarouselNext } from './carousel-next';
import { CarouselDots } from './carousel-dots';

const IMPORTS = [Carousel, CarouselContent, CarouselItem, CarouselPrev, CarouselNext, CarouselDots];

const BASIC = `
  <mui-carousel>
    <mui-carousel-content>
      <mui-carousel-item>Slide 1</mui-carousel-item>
      <mui-carousel-item>Slide 2</mui-carousel-item>
      <mui-carousel-item>Slide 3</mui-carousel-item>
    </mui-carousel-content>
    <button muiCarouselPrev></button>
    <button muiCarouselNext></button>
    <mui-carousel-dots></mui-carousel-dots>
  </mui-carousel>
`;

function getCarousel() {
  return document.querySelector('mui-carousel') as HTMLElement;
}

function getPrev() {
  return document.querySelector('[muiCarouselPrev]') as HTMLButtonElement;
}

function getNext() {
  return document.querySelector('[muiCarouselNext]') as HTMLButtonElement;
}

function getItems() {
  return Array.from(document.querySelectorAll('mui-carousel-item')) as HTMLElement[];
}

function getDots() {
  return Array.from(document.querySelectorAll('.dot')) as HTMLButtonElement[];
}

describe('Carousel', () => {
  it('has role=region', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getCarousel()).toHaveAttribute('role', 'region');
  });

  it('has aria-roledescription=carousel', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getCarousel()).toHaveAttribute('aria-roledescription', 'carousel');
  });

  it('default aria-label is "Carousel"', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getCarousel()).toHaveAttribute('aria-label', 'Carousel');
  });

  it('first slide is active by default', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getItems()[0]).toHaveAttribute('data-active');
    expect(getItems()[1]).not.toHaveAttribute('data-active');
  });

  it('each item has role=group and aria-roledescription=slide', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    getItems().forEach((item) => {
      expect(item).toHaveAttribute('role', 'group');
      expect(item).toHaveAttribute('aria-roledescription', 'slide');
    });
  });

  it('active item is not aria-hidden; others are', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const items = getItems();
    expect(items[0]).toHaveAttribute('aria-hidden', 'false');
    expect(items[1]).toHaveAttribute('aria-hidden', 'true');
    expect(items[2]).toHaveAttribute('aria-hidden', 'true');
  });

  it('items have aria-label with slide index and count', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getItems()[0]).toHaveAttribute('aria-label', 'Slide 1 of 3');
    expect(getItems()[2]).toHaveAttribute('aria-label', 'Slide 3 of 3');
  });

  it('prev button has aria-label "Previous slide"', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getPrev()).toHaveAttribute('aria-label', 'Previous slide');
  });

  it('next button has aria-label "Next slide"', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getNext()).toHaveAttribute('aria-label', 'Next slide');
  });

  it('prev is aria-disabled on first slide', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getPrev()).toHaveAttribute('aria-disabled', 'true');
  });

  it('next is not aria-disabled on first slide', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getNext()).toHaveAttribute('aria-disabled', 'false');
  });

  it('clicking next advances to slide 2', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getNext());
    const items = getItems();
    expect(items[1]).toHaveAttribute('data-active');
    expect(items[0]).not.toHaveAttribute('data-active');
  });

  it('clicking prev goes back from slide 2 to slide 1', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getNext());
    fireEvent.click(getPrev());
    expect(getItems()[0]).toHaveAttribute('data-active');
  });

  it('does not go before first slide without loop', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getPrev());
    expect(getItems()[0]).toHaveAttribute('data-active');
  });

  it('does not go past last slide without loop', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getNext());
    fireEvent.click(getNext());
    fireEvent.click(getNext()); // should stay on last
    expect(getItems()[2]).toHaveAttribute('data-active');
  });

  it('loops from last to first when loop=true', async () => {
    await renderTemplate(
      `<mui-carousel [loop]="true">
        <mui-carousel-content>
          <mui-carousel-item>A</mui-carousel-item>
          <mui-carousel-item>B</mui-carousel-item>
        </mui-carousel-content>
        <button muiCarouselNext></button>
      </mui-carousel>`,
      { imports: IMPORTS },
    );
    fireEvent.click(getNext());
    fireEvent.click(getNext()); // wraps to 0
    expect(getItems()[0]).toHaveAttribute('data-active');
  });

  it('ArrowRight key advances slide', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.keyDown(getCarousel(), { key: 'ArrowRight' });
    expect(getItems()[1]).toHaveAttribute('data-active');
  });

  it('ArrowLeft key goes back', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.keyDown(getCarousel(), { key: 'ArrowRight' });
    fireEvent.keyDown(getCarousel(), { key: 'ArrowLeft' });
    expect(getItems()[0]).toHaveAttribute('data-active');
  });

  it('dots renders one dot per slide', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getDots().length).toBe(3);
  });

  it('active dot has data-active', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getDots()[0]).toHaveAttribute('data-active');
    expect(getDots()[1]).not.toHaveAttribute('data-active');
  });

  it('clicking a dot jumps to that slide', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getDots()[2]);
    expect(getItems()[2]).toHaveAttribute('data-active');
    expect(getDots()[2]).toHaveAttribute('data-active');
  });

  it('dots have aria-label with slide number', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getDots()[0]).toHaveAttribute('aria-label', 'Go to slide 1');
    expect(getDots()[2]).toHaveAttribute('aria-label', 'Go to slide 3');
  });

  it('next is aria-disabled on last slide', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    fireEvent.click(getNext());
    fireEvent.click(getNext());
    expect(getNext()).toHaveAttribute('aria-disabled', 'true');
  });

  // T-4 — CarouselContent swipe gesture
  it('swipe left past threshold advances to next slide', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const content = document.querySelector('mui-carousel-content') as HTMLElement;
    Object.defineProperty(content, 'offsetWidth', { value: 400, configurable: true });

    fireEvent.pointerDown(content, { clientX: 300, pointerId: 1 });
    // delta = -120 px, threshold = 400 * 0.25 = 100 — exceeds threshold
    fireEvent.pointerUp(document, { clientX: 180, pointerId: 1 });

    expect(getItems()[1]).toHaveAttribute('data-active');
  });

  it('swipe right past threshold returns to previous slide', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const content = document.querySelector('mui-carousel-content') as HTMLElement;
    Object.defineProperty(content, 'offsetWidth', { value: 400, configurable: true });

    fireEvent.click(getNext()); // go to slide 2
    expect(getItems()[1]).toHaveAttribute('data-active');

    fireEvent.pointerDown(content, { clientX: 100, pointerId: 1 });
    // delta = +120 px — exceeds threshold
    fireEvent.pointerUp(document, { clientX: 220, pointerId: 1 });

    expect(getItems()[0]).toHaveAttribute('data-active');
  });

  it('swipe below threshold does not change slide', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const content = document.querySelector('mui-carousel-content') as HTMLElement;
    Object.defineProperty(content, 'offsetWidth', { value: 400, configurable: true });

    fireEvent.pointerDown(content, { clientX: 200, pointerId: 1 });
    // delta = -50 px, threshold = 100 — below threshold, no advance
    fireEvent.pointerUp(document, { clientX: 150, pointerId: 1 });

    expect(getItems()[0]).toHaveAttribute('data-active');
  });
});

describe('Carousel autoPlay (fake timers)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('H-U-6c850e: does not advance before the autoPlay interval elapses', async () => {
    const { detectChanges } = await renderTemplate(
      `<mui-carousel [autoPlay]="1000">
        <mui-carousel-content>
          <mui-carousel-item>Slide 1</mui-carousel-item>
          <mui-carousel-item>Slide 2</mui-carousel-item>
        </mui-carousel-content>
      </mui-carousel>`,
      { imports: IMPORTS },
    );
    vi.advanceTimersByTime(999);
    detectChanges();
    expect(getItems()[0]).toHaveAttribute('data-active');
  });

  it('H-U-6c850e: advances to the next slide once the autoPlay interval elapses', async () => {
    const { detectChanges } = await renderTemplate(
      `<mui-carousel [autoPlay]="1000">
        <mui-carousel-content>
          <mui-carousel-item>Slide 1</mui-carousel-item>
          <mui-carousel-item>Slide 2</mui-carousel-item>
        </mui-carousel-content>
      </mui-carousel>`,
      { imports: IMPORTS },
    );
    vi.advanceTimersByTime(1000);
    detectChanges();
    expect(getItems()[1]).toHaveAttribute('data-active');
  });

  it('H-U-6c850e: keeps advancing on every interval tick', async () => {
    const { detectChanges } = await renderTemplate(
      `<mui-carousel [autoPlay]="1000" [loop]="true">
        <mui-carousel-content>
          <mui-carousel-item>Slide 1</mui-carousel-item>
          <mui-carousel-item>Slide 2</mui-carousel-item>
          <mui-carousel-item>Slide 3</mui-carousel-item>
        </mui-carousel-content>
      </mui-carousel>`,
      { imports: IMPORTS },
    );
    vi.advanceTimersByTime(3000);
    detectChanges();
    expect(getItems()[0]).toHaveAttribute('data-active');
  });

  it('H-U-6c850e: does not set up a timer when autoPlay is 0 (default)', async () => {
    const { detectChanges } = await renderTemplate(BASIC, { imports: IMPORTS });
    vi.advanceTimersByTime(10000);
    detectChanges();
    expect(getItems()[0]).toHaveAttribute('data-active');
  });

  it('H-U-6c850e: clears the interval on destroy without throwing', async () => {
    const { fixture } = await renderTemplate(
      `<mui-carousel [autoPlay]="1000">
        <mui-carousel-content>
          <mui-carousel-item>Slide 1</mui-carousel-item>
          <mui-carousel-item>Slide 2</mui-carousel-item>
        </mui-carousel-content>
      </mui-carousel>`,
      { imports: IMPORTS },
    );
    expect(() => fixture.destroy()).not.toThrow();
    expect(() => vi.advanceTimersByTime(5000)).not.toThrow();
  });
});
