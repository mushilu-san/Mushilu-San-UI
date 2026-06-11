import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { AspectRatio } from './aspect-ratio';

describe('AspectRatio', () => {
  it('renders inner container', async () => {
    const { container } = await renderComponent(AspectRatio, { inputs: {} });
    expect(container.querySelector('.mui-aspect-ratio__inner')).toBeInTheDocument();
  });

  it('sets --_ratio CSS variable from ratio input', async () => {
    await renderComponent(AspectRatio, { inputs: { ratio: 1 } });
    const host = document.querySelector('mui-aspect-ratio') as HTMLElement;
    expect(host.style.getPropertyValue('--_ratio')).toBe('1');
  });

  it('defaults to 16/9 ratio', async () => {
    await renderComponent(AspectRatio, { inputs: {} });
    const host = document.querySelector('mui-aspect-ratio') as HTMLElement;
    const ratio = parseFloat(host.style.getPropertyValue('--_ratio'));
    expect(ratio).toBeCloseTo(16 / 9, 2);
  });

  it('projects content into inner container', async () => {
    await renderTemplate(
      `<mui-aspect-ratio><img src="test.png" alt="Test" /></mui-aspect-ratio>`,
      { imports: [AspectRatio] },
    );
    expect(document.querySelector('img')).toBeInTheDocument();
  });
});
