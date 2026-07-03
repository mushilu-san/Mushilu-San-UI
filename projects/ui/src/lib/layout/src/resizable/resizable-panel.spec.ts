import { WritableSignal, signal } from '@angular/core';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { RESIZABLE_GROUP_CONTEXT } from './resizable-context';
import type { ResizableGroupContext, ResizablePanelRegistration } from './resizable-context';
import { ResizablePanel } from './resizable-panel';

function makeCtx(): { ctx: ResizableGroupContext; sizes: WritableSignal<number>[] } {
  const sizes: WritableSignal<number>[] = [];
  const ctx: ResizableGroupContext = {
    direction: signal('horizontal'),
    registerPanel: vi.fn((defaultSize: number): ResizablePanelRegistration => {
      const size = signal(defaultSize);
      sizes.push(size);
      return { idx: sizes.length - 1, size };
    }),
    unregisterPanel: vi.fn(),
    startResize: vi.fn(),
    resizeByPercent: vi.fn(),
  };
  return { ctx, sizes };
}

function getPanel() {
  return document.querySelector('mui-resizable-panel') as HTMLElement;
}

describe('ResizablePanel', () => {
  it('registers with the group context using its size constraints on init', async () => {
    const { ctx } = makeCtx();
    await renderTemplate(
      '<mui-resizable-panel [defaultSize]="40" [minSize]="5" [maxSize]="95">Content</mui-resizable-panel>',
      {
        imports: [ResizablePanel],
        providers: [{ provide: RESIZABLE_GROUP_CONTEXT, useValue: ctx }],
      },
    );
    expect(ctx.registerPanel).toHaveBeenCalledWith(40, 5, 95);
  });

  it('binds flex-basis to the size signal returned by the registration', async () => {
    const { ctx, sizes } = makeCtx();
    const { detectChanges } = await renderTemplate(
      '<mui-resizable-panel [defaultSize]="40" [minSize]="5" [maxSize]="95">Content</mui-resizable-panel>',
      {
        imports: [ResizablePanel],
        providers: [{ provide: RESIZABLE_GROUP_CONTEXT, useValue: ctx }],
      },
    );
    sizes[0].set(70);
    detectChanges();
    expect(getPanel().style.flexBasis).toBe('70%');
  });

  it('exposes part="panel"', async () => {
    const { ctx } = makeCtx();
    await renderTemplate('<mui-resizable-panel>Content</mui-resizable-panel>', {
      imports: [ResizablePanel],
      providers: [{ provide: RESIZABLE_GROUP_CONTEXT, useValue: ctx }],
    });
    expect(getPanel()).toHaveAttribute('part', 'panel');
  });

  it('unregisters from the group context when destroyed (H-B-fb2777)', async () => {
    const { ctx } = makeCtx();
    const { rerender } = await renderTemplate(
      `@if (show) {
        <mui-resizable-panel [defaultSize]="40" [minSize]="5" [maxSize]="95">Content</mui-resizable-panel>
      }`,
      {
        imports: [ResizablePanel],
        providers: [{ provide: RESIZABLE_GROUP_CONTEXT, useValue: ctx }],
        componentProperties: { show: true },
      },
    );
    const registration = (ctx.registerPanel as ReturnType<typeof vi.fn>).mock.results[0]
      .value as ResizablePanelRegistration;

    await rerender({ componentProperties: { show: false } });

    expect(ctx.unregisterPanel).toHaveBeenCalledWith(registration);
  });
});
