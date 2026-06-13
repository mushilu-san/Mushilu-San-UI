import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { ScrollArea } from './scroll-area';

describe('ScrollArea', () => {
  it('renders viewport container', async () => {
    const { container } = await renderComponent(ScrollArea, { inputs: {} });
    expect(container.querySelector('.mui-scroll-area__viewport')).toBeInTheDocument();
  });

  it('defaults to vertical orientation', async () => {
    const { container } = await renderComponent(ScrollArea, { inputs: {} });
    expect(container).toHaveAttribute('data-orientation', 'vertical');
  });

  it('sets horizontal orientation', async () => {
    const { container } = await renderComponent(ScrollArea, {
      inputs: { orientation: 'horizontal' },
    });
    expect(container).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('sets both orientation', async () => {
    const { container } = await renderComponent(ScrollArea, { inputs: { orientation: 'both' } });
    expect(container).toHaveAttribute('data-orientation', 'both');
  });

  it('projects content into viewport', async () => {
    await renderTemplate(`<mui-scroll-area><p>Scrollable content</p></mui-scroll-area>`, {
      imports: [ScrollArea],
    });
    expect(document.querySelector('.mui-scroll-area__viewport p')).toBeInTheDocument();
  });
});
