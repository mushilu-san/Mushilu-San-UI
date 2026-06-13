import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Skeleton } from './skeleton';

const host = () => document.querySelector('mui-skeleton')!;

describe('Skeleton', () => {
  it('is hidden from assistive technology', async () => {
    await renderTemplate('<mui-skeleton></mui-skeleton>', { imports: [Skeleton] });
    expect(host()).toHaveAttribute('aria-hidden', 'true');
  });

  it('defaults to the text variant with a single line', async () => {
    await renderTemplate('<mui-skeleton></mui-skeleton>', { imports: [Skeleton] });
    expect(host()).toHaveAttribute('data-variant', 'text');
    expect(document.querySelectorAll('.mui-skeleton__item')).toHaveLength(1);
  });

  it('renders one item per line for the text variant', async () => {
    await renderTemplate('<mui-skeleton lines="3"></mui-skeleton>', { imports: [Skeleton] });
    expect(document.querySelectorAll('.mui-skeleton__item')).toHaveLength(3);
  });

  it('renders a single item for rect/circle regardless of lines', async () => {
    await renderTemplate('<mui-skeleton variant="rect" lines="3"></mui-skeleton>', {
      imports: [Skeleton],
    });
    expect(host()).toHaveAttribute('data-variant', 'rect');
    expect(document.querySelectorAll('.mui-skeleton__item')).toHaveLength(1);
  });

  it('applies custom width and height to the item', async () => {
    await renderTemplate(
      '<mui-skeleton variant="rect" width="200px" height="80px"></mui-skeleton>',
      {
        imports: [Skeleton],
      },
    );
    const item = document.querySelector('.mui-skeleton__item') as HTMLElement;
    expect(item.style.inlineSize).toBe('200px');
    expect(item.style.blockSize).toBe('80px');
  });

  it('uses width as the diameter for the circle variant', async () => {
    await renderTemplate('<mui-skeleton variant="circle" width="48px"></mui-skeleton>', {
      imports: [Skeleton],
    });
    const item = document.querySelector('.mui-skeleton__item') as HTMLElement;
    expect(item.style.inlineSize).toBe('48px');
    expect(item.style.blockSize).toBe('48px');
  });

  it('clamps lines to a minimum of one', async () => {
    await renderTemplate('<mui-skeleton lines="0"></mui-skeleton>', { imports: [Skeleton] });
    expect(document.querySelectorAll('.mui-skeleton__item')).toHaveLength(1);
  });
});
