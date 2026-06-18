import { fireEvent } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Carousel } from './carousel';
import { CarouselContent } from './carousel-content';
import { CarouselItem } from './carousel-item';

const IMPORTS = [Carousel, CarouselContent, CarouselItem];

const BASIC = `
  <mui-carousel [(active)]="active">
    <mui-carousel-content>
      <mui-carousel-item>Slide 1</mui-carousel-item>
      <mui-carousel-item>Slide 2</mui-carousel-item>
      <mui-carousel-item>Slide 3</mui-carousel-item>
    </mui-carousel-content>
  </mui-carousel>
`;

function getContent() {
  return document.querySelector('mui-carousel-content') as HTMLElement;
}

describe('CarouselContent', () => {
  it('has part="content" attribute', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS, componentProperties: { active: 0 } });
    expect(getContent()).toHaveAttribute('part', 'content');
  });

  it('applies translateX based on active index', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS, componentProperties: { active: 1 } });
    expect(getContent().style.transform).toBe('translateX(-100%)');
  });

  it('H-U-6b7fde: pointer drag left advances to next slide', async () => {
    const { detectChanges } = await renderTemplate(BASIC, {
      imports: IMPORTS,
      componentProperties: { active: 0 },
    });
    const content = getContent();
    vi.spyOn(content, 'offsetWidth', 'get').mockReturnValue(400);

    fireEvent.pointerDown(content, { clientX: 300, pointerId: 1 });
    fireEvent.pointerUp(document, { clientX: 100, pointerId: 1 });
    detectChanges();

    expect(getContent().style.transform).toBe('translateX(-100%)');
  });

  it('H-U-6b7fde: pointer drag right goes to previous slide', async () => {
    const { detectChanges } = await renderTemplate(BASIC, {
      imports: IMPORTS,
      componentProperties: { active: 1 },
    });
    const content = getContent();
    vi.spyOn(content, 'offsetWidth', 'get').mockReturnValue(400);

    fireEvent.pointerDown(content, { clientX: 100, pointerId: 1 });
    fireEvent.pointerUp(document, { clientX: 300, pointerId: 1 });
    detectChanges();

    expect(getContent().style.transform).toBe('translateX(-0%)');
  });

  it('H-U-6b7fde: small drag below threshold does not change slide', async () => {
    const { detectChanges } = await renderTemplate(BASIC, {
      imports: IMPORTS,
      componentProperties: { active: 0 },
    });
    const content = getContent();
    vi.spyOn(content, 'offsetWidth', 'get').mockReturnValue(400);

    fireEvent.pointerDown(content, { clientX: 200, pointerId: 1 });
    fireEvent.pointerUp(document, { clientX: 180, pointerId: 1 });
    detectChanges();

    expect(getContent().style.transform).toBe('translateX(-0%)');
  });

  it('H-U-6b7fde: pointerup without pointerdown is a no-op', async () => {
    await renderTemplate(BASIC, {
      imports: IMPORTS,
      componentProperties: { active: 0 },
    });
    expect(() => fireEvent.pointerUp(document, { clientX: 0, pointerId: 1 })).not.toThrow();
    expect(getContent().style.transform).toBe('translateX(-0%)');
  });
});
