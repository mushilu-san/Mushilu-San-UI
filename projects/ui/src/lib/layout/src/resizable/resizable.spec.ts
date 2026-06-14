import { By } from '@angular/platform-browser';
import { screen, fireEvent } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { ResizablePanelGroup } from './resizable-panel-group';
import { ResizablePanel } from './resizable-panel';
import { ResizableHandle } from './resizable-handle';

const IMPORTS = [ResizablePanelGroup, ResizablePanel, ResizableHandle];

const BASIC = `
  <mui-resizable-panel-group style="width:600px;height:400px;">
    <mui-resizable-panel [defaultSize]="50" [minSize]="10" [maxSize]="90">Left</mui-resizable-panel>
    <mui-resizable-handle />
    <mui-resizable-panel [defaultSize]="50" [minSize]="10" [maxSize]="90">Right</mui-resizable-panel>
  </mui-resizable-panel-group>
`;

function getHandle() {
  return document.querySelector('mui-resizable-handle') as HTMLElement;
}

function getPanels() {
  return Array.from(document.querySelectorAll('mui-resizable-panel')) as HTMLElement[];
}

describe('Resizable', () => {
  it('renders panel group with data-direction', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(document.querySelector('mui-resizable-panel-group')).toHaveAttribute(
      'data-direction',
      'horizontal',
    );
  });

  it('renders two panels', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getPanels().length).toBe(2);
  });

  it('renders handle with role=separator', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getHandle()).toHaveAttribute('role', 'separator');
  });

  it('handle has tabindex=0', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getHandle()).toHaveAttribute('tabindex', '0');
  });

  it('handle has aria-orientation=vertical for horizontal group', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getHandle()).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('vertical group has aria-orientation=horizontal on handle', async () => {
    await renderTemplate(
      `<mui-resizable-panel-group direction="vertical" style="width:400px;height:400px;">
        <mui-resizable-panel>Top</mui-resizable-panel>
        <mui-resizable-handle />
        <mui-resizable-panel>Bottom</mui-resizable-panel>
      </mui-resizable-panel-group>`,
      { imports: IMPORTS },
    );
    expect(getHandle()).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('panels start at default size percentages', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const [left, right] = getPanels();
    expect(parseFloat((left as HTMLElement).style.flexBasis)).toBeCloseTo(50, 1);
    expect(parseFloat((right as HTMLElement).style.flexBasis)).toBeCloseTo(50, 1);
  });

  it('withHandle shows a grip element', async () => {
    await renderTemplate(
      `<mui-resizable-panel-group style="width:600px;height:400px;">
        <mui-resizable-panel>A</mui-resizable-panel>
        <mui-resizable-handle [withHandle]="true" />
        <mui-resizable-panel>B</mui-resizable-panel>
      </mui-resizable-panel-group>`,
      { imports: IMPORTS },
    );
    expect(document.querySelector('.handle-grip')).toBeInTheDocument();
  });

  it('without withHandle there is no grip element', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(document.querySelector('.handle-grip')).not.toBeInTheDocument();
  });

  it('handle has data-direction attribute', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(getHandle()).toHaveAttribute('data-direction', 'horizontal');
  });

  it('label text inside panels is accessible', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('vertical group sets data-direction=vertical', async () => {
    await renderTemplate(
      `<mui-resizable-panel-group direction="vertical" style="width:400px;height:400px;">
        <mui-resizable-panel>A</mui-resizable-panel>
        <mui-resizable-handle />
        <mui-resizable-panel>B</mui-resizable-panel>
      </mui-resizable-panel-group>`,
      { imports: IMPORTS },
    );
    expect(document.querySelector('mui-resizable-panel-group')).toHaveAttribute(
      'data-direction',
      'vertical',
    );
  });

  it('unequal default sizes are normalized to 100%', async () => {
    await renderTemplate(
      `<mui-resizable-panel-group style="width:600px;height:400px;">
        <mui-resizable-panel [defaultSize]="30">A</mui-resizable-panel>
        <mui-resizable-handle />
        <mui-resizable-panel [defaultSize]="70">B</mui-resizable-panel>
      </mui-resizable-panel-group>`,
      { imports: IMPORTS },
    );
    const [a, b] = getPanels();
    expect(parseFloat(a.style.flexBasis)).toBeCloseTo(30, 1);
    expect(parseFloat(b.style.flexBasis)).toBeCloseTo(70, 1);
  });

  it('ArrowRight on handle moves panel A larger', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const handle = getHandle();
    const [left] = getPanels();
    const initialSize = parseFloat(left.style.flexBasis);
    fireEvent.keyDown(handle, { key: 'ArrowRight', code: 'ArrowRight' });
    const newSize = parseFloat(left.style.flexBasis);
    expect(newSize).toBeGreaterThan(initialSize);
  });

  it('ArrowLeft on handle moves panel A smaller', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const handle = getHandle();
    const [left] = getPanels();
    const initialSize = parseFloat(left.style.flexBasis);
    fireEvent.keyDown(handle, { key: 'ArrowLeft', code: 'ArrowLeft' });
    const newSize = parseFloat(left.style.flexBasis);
    expect(newSize).toBeLessThan(initialSize);
  });

  it('Shift+ArrowRight moves 10 percent', async () => {
    await renderTemplate(BASIC, { imports: IMPORTS });
    const handle = getHandle();
    const [left] = getPanels();
    const initialSize = parseFloat(left.style.flexBasis);
    fireEvent.keyDown(handle, { key: 'ArrowRight', shiftKey: true });
    const newSize = parseFloat(left.style.flexBasis);
    expect(newSize).toBeCloseTo(initialSize + 10, 1);
  });

  it('pointer drag increases left panel size', async () => {
    await renderTemplate(
      `<mui-resizable-panel-group style="width:600px;height:400px;">
        <mui-resizable-panel [defaultSize]="50" [minSize]="10" [maxSize]="90">L</mui-resizable-panel>
        <mui-resizable-handle />
        <mui-resizable-panel [defaultSize]="50" [minSize]="10" [maxSize]="90">R</mui-resizable-panel>
      </mui-resizable-panel-group>`,
      { imports: IMPORTS },
    );
    const group = document.querySelector('mui-resizable-panel-group') as HTMLElement;
    const handle = getHandle();
    const [left] = getPanels();

    /* jsdom has no layout, so getBoundingClientRect returns zero — fake it */
    vi.spyOn(group, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 600,
      height: 400,
      right: 600,
      bottom: 400,
      x: 0,
      y: 0,
    } as DOMRect);

    fireEvent.pointerDown(handle, { clientX: 300, clientY: 0, pointerId: 1 });
    fireEvent.pointerMove(document, { clientX: 360, clientY: 0, pointerId: 1 });
    fireEvent.pointerUp(document, { pointerId: 1 });

    expect(parseFloat(left.style.flexBasis)).toBeGreaterThan(50);
  });

  it('resizeByPercent on a detached handle returns without throwing (B-5)', async () => {
    const { fixture } = await renderTemplate(BASIC, { imports: IMPORTS });
    const group = fixture.debugElement.query(By.directive(ResizablePanelGroup))
      .componentInstance as ResizablePanelGroup;
    const detached = document.createElement('div'); // no parentElement
    expect(() => group.resizeByPercent(detached, 10)).not.toThrow();
  });

  it('pointer drag respects maxSize', async () => {
    await renderTemplate(
      `<mui-resizable-panel-group style="width:600px;height:400px;">
        <mui-resizable-panel [defaultSize]="50" [minSize]="10" [maxSize]="60">L</mui-resizable-panel>
        <mui-resizable-handle />
        <mui-resizable-panel [defaultSize]="50" [minSize]="10" [maxSize]="90">R</mui-resizable-panel>
      </mui-resizable-panel-group>`,
      { imports: IMPORTS },
    );
    const group = document.querySelector('mui-resizable-panel-group') as HTMLElement;
    const handle = getHandle();
    const [left] = getPanels();

    vi.spyOn(group, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 600,
      height: 400,
      right: 600,
      bottom: 400,
      x: 0,
      y: 0,
    } as DOMRect);

    /* Drag far right — should stop at maxSize=60 */
    fireEvent.pointerDown(handle, { clientX: 300, clientY: 0, pointerId: 1 });
    fireEvent.pointerMove(document, { clientX: 600, clientY: 0, pointerId: 1 });
    fireEvent.pointerUp(document, { pointerId: 1 });

    expect(parseFloat(left.style.flexBasis)).toBeLessThanOrEqual(60);
  });

  it('drag conserves total panel size', async () => {
    await renderTemplate(
      `<mui-resizable-panel-group style="width:600px;height:400px;">
        <mui-resizable-panel [defaultSize]="50" [minSize]="10" [maxSize]="90">L</mui-resizable-panel>
        <mui-resizable-handle />
        <mui-resizable-panel [defaultSize]="50" [minSize]="10" [maxSize]="90">R</mui-resizable-panel>
      </mui-resizable-panel-group>`,
      { imports: IMPORTS },
    );
    const group = document.querySelector('mui-resizable-panel-group') as HTMLElement;
    const handle = getHandle();
    const panels = getPanels();

    vi.spyOn(group, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 600,
      height: 400,
      right: 600,
      bottom: 400,
      x: 0,
      y: 0,
    } as DOMRect);

    fireEvent.pointerDown(handle, { clientX: 300, clientY: 0, pointerId: 1 });
    fireEvent.pointerMove(document, { clientX: 360, clientY: 0, pointerId: 1 });
    fireEvent.pointerUp(document, { pointerId: 1 });

    const total = panels.reduce((s, p) => s + parseFloat(p.style.flexBasis), 0);
    expect(total).toBeCloseTo(100, 0);
  });

  it('pointer drag respects minSize', async () => {
    await renderTemplate(
      `<mui-resizable-panel-group style="width:600px;height:400px;">
        <mui-resizable-panel [defaultSize]="50" [minSize]="40" [maxSize]="90">L</mui-resizable-panel>
        <mui-resizable-handle />
        <mui-resizable-panel [defaultSize]="50" [minSize]="10" [maxSize]="60">R</mui-resizable-panel>
      </mui-resizable-panel-group>`,
      { imports: IMPORTS },
    );
    const group = document.querySelector('mui-resizable-panel-group') as HTMLElement;
    const handle = getHandle();
    const [left] = getPanels();

    vi.spyOn(group, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 600,
      height: 400,
      right: 600,
      bottom: 400,
      x: 0,
      y: 0,
    } as DOMRect);

    /* Drag far left — should stop at minSize=40 */
    fireEvent.pointerDown(handle, { clientX: 300, clientY: 0, pointerId: 1 });
    fireEvent.pointerMove(document, { clientX: 0, clientY: 0, pointerId: 1 });
    fireEvent.pointerUp(document, { pointerId: 1 });

    expect(parseFloat(left.style.flexBasis)).toBeGreaterThanOrEqual(40);
  });
});
