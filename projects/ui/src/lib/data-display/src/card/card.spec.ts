import { fireEvent } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Card } from './card';

describe('Card', () => {
  it('renders with default flat variant', async () => {
    await renderTemplate('<mui-card></mui-card>', { imports: [Card] });
    expect(document.querySelector('mui-card')).toHaveAttribute('data-variant', 'flat');
  });

  it('renders elevated variant', async () => {
    await renderTemplate('<mui-card variant="elevated"></mui-card>', { imports: [Card] });
    expect(document.querySelector('mui-card')).toHaveAttribute('data-variant', 'elevated');
  });

  it('renders outlined variant', async () => {
    await renderTemplate('<mui-card variant="outlined"></mui-card>', { imports: [Card] });
    expect(document.querySelector('mui-card')).toHaveAttribute('data-variant', 'outlined');
  });

  it('has no role or tabindex by default', async () => {
    await renderTemplate('<mui-card></mui-card>', { imports: [Card] });
    const host = document.querySelector('mui-card')!;
    expect(host).not.toHaveAttribute('role');
    expect(host).not.toHaveAttribute('tabindex');
  });

  it('adds role=button and tabindex=0 when clickable', async () => {
    await renderTemplate('<mui-card [clickable]="true"></mui-card>', { imports: [Card] });
    const host = document.querySelector('mui-card')!;
    expect(host).toHaveAttribute('role', 'button');
    expect(host).toHaveAttribute('tabindex', '0');
  });

  it('emits clicked on host click when clickable', async () => {
    const handler = vi.fn();
    await renderTemplate('<mui-card [clickable]="true" (clicked)="h()">Content</mui-card>', {
      imports: [Card],
      componentProperties: { h: handler },
    });
    fireEvent.click(document.querySelector('mui-card')!);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not emit clicked when not clickable', async () => {
    const handler = vi.fn();
    await renderTemplate('<mui-card (clicked)="h()">Content</mui-card>', {
      imports: [Card],
      componentProperties: { h: handler },
    });
    fireEvent.click(document.querySelector('mui-card')!);
    expect(handler).not.toHaveBeenCalled();
  });

  it('emits clicked on Enter key', async () => {
    const handler = vi.fn();
    await renderTemplate('<mui-card [clickable]="true" (clicked)="h()">Content</mui-card>', {
      imports: [Card],
      componentProperties: { h: handler },
    });
    fireEvent.keyDown(document.querySelector('mui-card')!, { key: 'Enter' });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('emits clicked on Space key', async () => {
    const handler = vi.fn();
    await renderTemplate('<mui-card [clickable]="true" (clicked)="h()">Content</mui-card>', {
      imports: [Card],
      componentProperties: { h: handler },
    });
    fireEvent.keyDown(document.querySelector('mui-card')!, { key: ' ' });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('projects content via ng-content', async () => {
    await renderTemplate('<mui-card>Hello Card</mui-card>', { imports: [Card] });
    expect(document.querySelector('mui-card')!.textContent).toContain('Hello Card');
  });

  it('exposes part=root', async () => {
    await renderTemplate('<mui-card></mui-card>', { imports: [Card] });
    expect(document.querySelector('mui-card')).toHaveAttribute('part', 'root');
  });
});
