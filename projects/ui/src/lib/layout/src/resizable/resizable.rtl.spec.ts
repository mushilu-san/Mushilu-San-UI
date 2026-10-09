import { fireEvent } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { ResizableHandle } from './resizable-handle';
import { ResizablePanel } from './resizable-panel';
import { ResizablePanelGroup } from './resizable-panel-group';

const IMPORTS = [ResizablePanelGroup, ResizablePanel, ResizableHandle];

const tpl = (dir: string, direction = 'horizontal') => `
  <div dir="${dir}">
    <mui-resizable-panel-group direction="${direction}">
      <mui-resizable-panel [defaultSize]="50" [minSize]="10" [maxSize]="90">A</mui-resizable-panel>
      <mui-resizable-handle />
      <mui-resizable-panel [defaultSize]="50" [minSize]="10" [maxSize]="90">B</mui-resizable-panel>
    </mui-resizable-panel-group>
  </div>`;

const handle = () => document.querySelector('mui-resizable-handle') as HTMLElement;
const sizeA = () =>
  parseFloat((document.querySelector('mui-resizable-panel') as HTMLElement).style.flexBasis);

async function drag(dir: string, direction: string, dx: number) {
  const { detectChanges } = await renderTemplate(tpl(dir, direction), { imports: IMPORTS });
  const group = document.querySelector('mui-resizable-panel-group') as HTMLElement;
  vi.spyOn(group, 'getBoundingClientRect').mockReturnValue({
    width: 1000,
    height: 1000,
  } as DOMRect);
  fireEvent.pointerDown(handle(), { clientX: 500, clientY: 500, pointerId: 1 });
  fireEvent.pointerMove(document, { clientX: 500 + dx, clientY: 500 + dx, pointerId: 1 });
  fireEvent.pointerUp(document, { pointerId: 1 });
  detectChanges();
  return sizeA();
}

describe('Resizable RTL', () => {
  it('H-B-adcc73 / H-A-6c3721: pointer drag right shrinks panel A under rtl', async () => {
    expect(await drag('rtl', 'horizontal', 100)).toBeCloseTo(40);
  });

  it('H-B-adcc73: pointer drag right grows panel A under ltr', async () => {
    expect(await drag('ltr', 'horizontal', 100)).toBeCloseTo(60);
  });

  it('H-B-adcc73: vertical drag is unchanged under rtl', async () => {
    expect(await drag('rtl', 'vertical', 100)).toBeCloseTo(60);
  });

  it('H-B-bfbaef / H-A-90c384 / H-C-b81474 / H-U-606d5e: ArrowLeft grows panel A under rtl', async () => {
    const { detectChanges } = await renderTemplate(tpl('rtl'), { imports: IMPORTS });
    fireEvent.keyDown(handle(), { key: 'ArrowLeft', shiftKey: true });
    detectChanges();
    expect(sizeA()).toBeCloseTo(60);
    fireEvent.keyDown(handle(), { key: 'ArrowRight', shiftKey: true });
    fireEvent.keyDown(handle(), { key: 'ArrowRight', shiftKey: true });
    detectChanges();
    expect(sizeA()).toBeCloseTo(40);
  });

  it('H-B-bfbaef: ArrowRight grows panel A under ltr', async () => {
    const { detectChanges } = await renderTemplate(tpl('ltr'), { imports: IMPORTS });
    fireEvent.keyDown(handle(), { key: 'ArrowRight', shiftKey: true });
    detectChanges();
    expect(sizeA()).toBeCloseTo(60);
  });

  it('H-B-bfbaef: vertical ArrowDown still grows under rtl', async () => {
    const { detectChanges } = await renderTemplate(tpl('rtl', 'vertical'), { imports: IMPORTS });
    fireEvent.keyDown(handle(), { key: 'ArrowDown', shiftKey: true });
    detectChanges();
    expect(sizeA()).toBeCloseTo(60);
  });
});
