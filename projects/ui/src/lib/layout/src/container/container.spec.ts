import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Container } from './container';

describe('Container', () => {
  it('renders projected content', async () => {
    await renderTemplate('<mui-container>Hello</mui-container>', { imports: [Container] });
    expect(document.querySelector('mui-container')?.textContent?.trim()).toBe('Hello');
  });

  it('defaults to lg size', async () => {
    await renderTemplate('<mui-container></mui-container>', { imports: [Container] });
    expect(document.querySelector('mui-container')).toHaveAttribute('data-size', 'lg');
  });

  it('reflects size as data-size attribute', async () => {
    await renderTemplate('<mui-container size="sm"></mui-container>', { imports: [Container] });
    expect(document.querySelector('mui-container')).toHaveAttribute('data-size', 'sm');
  });

  it('supports the full size', async () => {
    await renderTemplate('<mui-container size="full"></mui-container>', { imports: [Container] });
    expect(document.querySelector('mui-container')).toHaveAttribute('data-size', 'full');
  });

  it('is padded by default', async () => {
    await renderTemplate('<mui-container></mui-container>', { imports: [Container] });
    expect(document.querySelector('mui-container')).toHaveAttribute('data-padded');
  });

  it('removes data-padded when padded is false', async () => {
    await renderTemplate('<mui-container [padded]="false"></mui-container>', {
      imports: [Container],
    });
    expect(document.querySelector('mui-container')).not.toHaveAttribute('data-padded');
  });

  it('exposes a part="root" attribute for styling hooks', async () => {
    await renderTemplate('<mui-container></mui-container>', { imports: [Container] });
    expect(document.querySelector('mui-container')).toHaveAttribute('part', 'root');
  });
});
