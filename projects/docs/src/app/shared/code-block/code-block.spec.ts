import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CodeBlock, plainLines } from './code-block';

describe('CodeBlock', () => {
  const writeText = vi.fn<(text: string) => Promise<void>>();

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  });

  it('renders one span per token with its kind class', async () => {
    await render(CodeBlock, {
      inputs: {
        lines: [
          [
            { t: 'kw', v: 'const' },
            { t: 'plain', v: ' x' },
          ],
        ],
        source: 'const x',
      },
    });
    expect(screen.getByText('const')).toHaveClass('tok-kw');
  });

  it('preserves source whitespace and blank lines exactly in rendered text', async () => {
    const source = '  const a = 1;\n\n    return  a;';
    const { container } = await render(CodeBlock, {
      inputs: {
        lines: [
          [
            { t: 'plain', v: '  ' },
            { t: 'kw', v: 'const' },
            { t: 'plain', v: ' a = ' },
            { t: 'num', v: '1' },
            { t: 'punc', v: ';' },
          ],
          [],
          [
            { t: 'plain', v: '    ' },
            { t: 'kw', v: 'return' },
            { t: 'plain', v: '  a;' },
          ],
        ],
        source,
      },
    });
    const lines = Array.from(container.querySelectorAll('.line')).map((l) => l.textContent);
    expect(lines).toEqual(source.split('\n'));
  });

  it('copies the raw source and announces it', async () => {
    await render(CodeBlock, {
      inputs: { lines: plainLines('a\nb'), source: 'a\nb', label: 'demo.ts' },
    });
    await userEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(writeText).toHaveBeenCalledWith('a\nb');
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Code copied to clipboard'),
    );
    expect(screen.getByRole('button', { name: 'Copy code' })).toHaveTextContent('Copied');
  });

  it('reports failure, never success, when the clipboard rejects', async () => {
    writeText.mockRejectedValue(new Error('denied'));
    await render(CodeBlock, { inputs: { lines: plainLines('a'), source: 'a' } });
    const button = screen.getByRole('button', { name: 'Copy code' });
    const seen: string[] = [];
    const observer = new MutationObserver(() => seen.push(document.body.textContent ?? ''));
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    await userEvent.click(button);
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copy failed'));
    observer.disconnect();
    expect(button).toHaveAccessibleName('Copy code');
    expect(button).toHaveTextContent('Copy failed');
    expect(seen.some((t) => t.includes('Code copied'))).toBe(false);
    expect(screen.queryByText('Copied')).toBeNull();
  });

  it('reports failure when navigator.clipboard is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    await render(CodeBlock, { inputs: { lines: plainLines('a'), source: 'a' } });
    await userEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copy failed'));
  });

  it('reverts to idle 2s after copying', async () => {
    const { fixture } = await render(CodeBlock, {
      inputs: { lines: plainLines('a'), source: 'a' },
    });
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    try {
      const button = screen.getByRole('button', { name: 'Copy code' });
      button.click();
      for (let i = 0; i < 5; i++) await Promise.resolve(); // let writeText settle
      fixture.detectChanges();
      expect(button).toHaveTextContent('Copied');
      vi.advanceTimersByTime(1999);
      fixture.detectChanges();
      expect(button).toHaveTextContent('Copied');
      vi.advanceTimersByTime(1);
      fixture.detectChanges();
      expect(button).toHaveTextContent(/^\s*Copy\s*$/);
    } finally {
      vi.useRealTimers();
    }
  });

  it('makes the scrollable code region keyboard focusable and labelled', async () => {
    await render(CodeBlock, { inputs: { lines: plainLines('a'), source: 'a', label: 'demo.ts' } });
    const region = screen.getByRole('region', { name: 'demo.ts source' });
    expect(region).toHaveAttribute('tabindex', '0');
  });

  it('plainLines splits text into one plain token per line', () => {
    expect(plainLines('a\n\nb')).toEqual([[{ t: 'plain', v: 'a' }], [], [{ t: 'plain', v: 'b' }]]);
  });
});
