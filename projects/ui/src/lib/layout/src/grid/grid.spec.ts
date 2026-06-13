import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Grid } from './grid';

describe('Grid', () => {
  it('renders projected content', async () => {
    await renderTemplate('<mui-grid>Content</mui-grid>', { imports: [Grid] });
    expect(document.querySelector('mui-grid')?.textContent?.trim()).toBe('Content');
  });

  it('is a grid container', async () => {
    await renderTemplate('<mui-grid></mui-grid>', { imports: [Grid] });
    const host = document.querySelector('mui-grid') as HTMLElement;
    expect(getComputedStyle(host).display).toBe('grid');
  });

  it('builds grid-template-columns from the columns input', async () => {
    await renderTemplate('<mui-grid [columns]="3"></mui-grid>', { imports: [Grid] });
    const host = document.querySelector('mui-grid') as HTMLElement;
    expect(host.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('defaults to a single column', async () => {
    await renderTemplate('<mui-grid></mui-grid>', { imports: [Grid] });
    const host = document.querySelector('mui-grid') as HTMLElement;
    expect(host.style.gridTemplateColumns).toBe('repeat(1, minmax(0, 1fr))');
  });

  it('applies gap to both column-gap and row-gap by default', async () => {
    await renderTemplate('<mui-grid [gap]="6"></mui-grid>', { imports: [Grid] });
    const host = document.querySelector('mui-grid') as HTMLElement;
    expect(host.style.columnGap).toBe('var(--mui-space-6, 0px)');
    expect(host.style.rowGap).toBe('var(--mui-space-6, 0px)');
  });

  it('lets columnGap/rowGap override the shared gap', async () => {
    await renderTemplate('<mui-grid [gap]="4" [columnGap]="8" [rowGap]="2"></mui-grid>', {
      imports: [Grid],
    });
    const host = document.querySelector('mui-grid') as HTMLElement;
    expect(host.style.columnGap).toBe('var(--mui-space-8, 0px)');
    expect(host.style.rowGap).toBe('var(--mui-space-2, 0px)');
  });

  it('maps align to align-items', async () => {
    await renderTemplate('<mui-grid align="center"></mui-grid>', { imports: [Grid] });
    const host = document.querySelector('mui-grid') as HTMLElement;
    expect(host.style.alignItems).toBe('center');
  });

  it('maps justify to justify-items', async () => {
    await renderTemplate('<mui-grid justify="end"></mui-grid>', { imports: [Grid] });
    const host = document.querySelector('mui-grid') as HTMLElement;
    expect(host.style.justifyItems).toBe('end');
  });

  it('exposes a part="root" attribute for styling hooks', async () => {
    await renderTemplate('<mui-grid></mui-grid>', { imports: [Grid] });
    expect(document.querySelector('mui-grid')).toHaveAttribute('part', 'root');
  });
});
