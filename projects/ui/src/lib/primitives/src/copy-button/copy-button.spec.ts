import { fireEvent, screen, waitFor } from '@testing-library/angular';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { CopyButton } from './copy-button';

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('CopyButton', () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('copies the text input and announces copied', async () => {
    await renderTemplate('<mui-copy-button text="npm i x" />', { imports: [CopyButton] });
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await flush();
    expect(writeText).toHaveBeenCalledWith('npm i x');
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copied'));
  });

  it('copies the source element text at click time', async () => {
    const el = document.createElement('code');
    el.textContent = 'first';
    await renderTemplate('<mui-copy-button [source]="el" />', {
      imports: [CopyButton],
      componentProperties: { el },
    });
    el.textContent = 'second';
    fireEvent.click(screen.getByRole('button'));
    await flush();
    expect(writeText).toHaveBeenCalledWith('second');
  });

  it('uses translatable labels', async () => {
    await renderTemplate('<mui-copy-button text="x" label="העתק" copiedLabel="הועתק" />', {
      imports: [CopyButton],
    });
    fireEvent.click(screen.getByRole('button', { name: 'העתק' }));
    await flush();
    await waitFor(() => expect(screen.getByRole('button', { name: 'הועתק' })).toBeInTheDocument());
  });

  it('returns to idle after resetDelay', async () => {
    await renderTemplate('<mui-copy-button text="x" [resetDelay]="30" />', {
      imports: [CopyButton],
    });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copied'));
    await waitFor(() => expect(screen.getByRole('status').textContent?.trim()).toBe(''));
  });

  it('emits failed and does not announce when the clipboard rejects', async () => {
    writeText.mockRejectedValue(new Error('denied'));
    const failed = vi.fn();
    await renderTemplate('<mui-copy-button text="x" (failed)="failed()" />', {
      imports: [CopyButton],
      componentProperties: { failed },
    });
    fireEvent.click(screen.getByRole('button'));
    await flush();
    expect(failed).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status').textContent?.trim()).toBe('');
  });

  it('emits failed when the Clipboard API is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    const failed = vi.fn();
    await renderTemplate('<mui-copy-button text="x" (failed)="failed()" />', {
      imports: [CopyButton],
      componentProperties: { failed },
    });
    fireEvent.click(screen.getByRole('button'));
    await flush();
    expect(failed).toHaveBeenCalledTimes(1);
  });

  it('emits copiedText with the value', async () => {
    const h = vi.fn();
    await renderTemplate('<mui-copy-button text="abc" (copiedText)="h($event)" />', {
      imports: [CopyButton],
      componentProperties: { h },
    });
    fireEvent.click(screen.getByRole('button'));
    await flush();
    expect(h).toHaveBeenCalledWith('abc');
  });

  it('icons are decorative', async () => {
    await renderTemplate('<mui-copy-button text="x" />', { imports: [CopyButton] });
    expect(document.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
