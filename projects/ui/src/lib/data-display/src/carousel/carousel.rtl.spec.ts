import { fireEvent } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Carousel } from './carousel';
import { CarouselContent } from './carousel-content';
import { CarouselItem } from './carousel-item';
import { CarouselNext } from './carousel-next';
import { CarouselPrev } from './carousel-prev';

const IMPORTS = [Carousel, CarouselContent, CarouselItem, CarouselPrev, CarouselNext];

const tpl = (dir: string) => `
  <div dir="${dir}">
    <mui-carousel [(active)]="active">
      <mui-carousel-content>
        <mui-carousel-item>1</mui-carousel-item>
        <mui-carousel-item>2</mui-carousel-item>
        <mui-carousel-item>3</mui-carousel-item>
      </mui-carousel-content>
      <button muiCarouselPrev></button>
      <button muiCarouselNext></button>
    </mui-carousel>
  </div>`;

const content = () => document.querySelector('mui-carousel-content') as HTMLElement;
const root = () => document.querySelector('mui-carousel') as HTMLElement;

describe('Carousel RTL', () => {
  it('H-B-81647a: translates positively under dir=rtl', async () => {
    await renderTemplate(tpl('rtl'), { imports: IMPORTS, componentProperties: { active: 1 } });
    expect(content().style.transform).toBe('translateX(100%)');
  });

  it('H-B-81647a: keeps negative translate under dir=ltr', async () => {
    await renderTemplate(tpl('ltr'), { imports: IMPORTS, componentProperties: { active: 1 } });
    expect(content().style.transform).toBe('translateX(-100%)');
  });

  it('H-A-7121c7: drag right advances to next slide under rtl', async () => {
    const { detectChanges } = await renderTemplate(tpl('rtl'), {
      imports: IMPORTS,
      componentProperties: { active: 0 },
    });
    vi.spyOn(content(), 'offsetWidth', 'get').mockReturnValue(400);
    fireEvent.pointerDown(content(), { clientX: 100, pointerId: 1 });
    fireEvent.pointerUp(document, { clientX: 300, pointerId: 1 });
    detectChanges();
    expect(content().style.transform).toBe('translateX(100%)');
  });

  it('H-A-7121c7: drag left goes to previous slide under rtl', async () => {
    const { detectChanges } = await renderTemplate(tpl('rtl'), {
      imports: IMPORTS,
      componentProperties: { active: 1 },
    });
    vi.spyOn(content(), 'offsetWidth', 'get').mockReturnValue(400);
    fireEvent.pointerDown(content(), { clientX: 300, pointerId: 1 });
    fireEvent.pointerUp(document, { clientX: 100, pointerId: 1 });
    detectChanges();
    expect(content().style.transform).toBe('translateX(0%)');
  });

  it('H-A-e64f76: ArrowLeft = next, ArrowRight = prev under rtl', async () => {
    const { detectChanges } = await renderTemplate(tpl('rtl'), {
      imports: IMPORTS,
      componentProperties: { active: 0 },
    });
    fireEvent.keyDown(root(), { key: 'ArrowLeft' });
    detectChanges();
    expect(content().style.transform).toBe('translateX(100%)');
    fireEvent.keyDown(root(), { key: 'ArrowRight' });
    detectChanges();
    expect(content().style.transform).toBe('translateX(0%)');
  });

  it('H-A-e64f76: ArrowRight = next, ArrowLeft = prev under ltr', async () => {
    const { detectChanges } = await renderTemplate(tpl('ltr'), {
      imports: IMPORTS,
      componentProperties: { active: 0 },
    });
    fireEvent.keyDown(root(), { key: 'ArrowRight' });
    detectChanges();
    expect(content().style.transform).toBe('translateX(-100%)');
    fireEvent.keyDown(root(), { key: 'ArrowLeft' });
    detectChanges();
    expect(content().style.transform).toBe('translateX(-0%)');
  });

  it('H-A-e64f76: other keys are ignored', async () => {
    await renderTemplate(tpl('ltr'), { imports: IMPORTS, componentProperties: { active: 0 } });
    fireEvent.keyDown(root(), { key: 'a' });
    expect(content().style.transform).toBe('translateX(-0%)');
  });
});
