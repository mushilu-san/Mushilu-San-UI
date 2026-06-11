import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { AspectRatio } from './aspect-ratio';

describe('AspectRatio', () => {
  it('renders inner container', async () => {
    const { container } = await renderComponent(AspectRatio, { inputs: {} });
    expect(container.querySelector('.mui-aspect-ratio__inner')).toBeInTheDocument();
  });

  it('sets --_ratio CSS variable from ratio input', async () => {
    const { container } = await renderComponent(AspectRatio, { inputs: { ratio: 1 } });
    const host = container as HTMLElement;
    const val = host.style.getPropertyValue('--_ratio');
    expect(parseFloat(val)).toBeCloseTo(1, 2);
  });

  it('defaults to 16/9 ratio', async () => {
    const { container } = await renderComponent(AspectRatio, { inputs: {} });
    const host = container as HTMLElement;
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
