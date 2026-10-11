import { provideMushiluUi } from '@mushilu-san/ui';
import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ThemePlayground } from './theme-playground';

const providers = [provideMushiluUi()];

function setClipboard(writeText: ReturnType<typeof vi.fn> | undefined): void {
  Object.defineProperty(window.navigator, 'clipboard', {
    value: writeText ? { writeText } : undefined,
    configurable: true,
  });
}

describe('ThemePlayground', () => {
  afterEach(() => setClipboard(undefined));

  it('starts with no changes and an empty CSS export', async () => {
    await render(ThemePlayground, { providers });
    expect(screen.getByRole('textbox', { name: 'CSS' })).toHaveValue(
      '/* No changes from the default theme. */',
    );
  });

  it('exports a changed colour in the CSS and in the preview scope', async () => {
    const { container } = await render(ThemePlayground, { providers });
    const primary = screen.getByLabelText('Primary');
    fireEvent.input(primary, { target: { value: '#7c3aed' } });
    expect(screen.getByRole('textbox', { name: 'CSS' })).toHaveValue(
      ':root {\n  --mui-color-primary: #7c3aed;\n}',
    );
    expect(container.querySelector('.preview')?.getAttribute('style')).toContain(
      '--mui-color-primary: #7c3aed',
    );
  });

  it('restores the defaults on Reset', async () => {
    await render(ThemePlayground, { providers });
    fireEvent.input(screen.getByLabelText('Primary'), { target: { value: '#7c3aed' } });
    await userEvent.click(screen.getByRole('button', { name: 'Reset to defaults' }));
    expect(screen.getByLabelText('Primary')).toHaveValue('#2563eb');
    expect(screen.getByRole('textbox', { name: 'CSS' })).toHaveValue(
      '/* No changes from the default theme. */',
    );
  });

  it('reports a copy when the clipboard accepts the CSS', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    await render(ThemePlayground, { providers });
    await userEvent.click(screen.getByRole('button', { name: 'Copy CSS' }));
    expect(writeText).toHaveBeenCalledWith('/* No changes from the default theme. */');
    expect(await screen.findByRole('status')).toHaveTextContent('CSS copied.');
  });

  it('explains what to do when the clipboard rejects the copy', async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error('denied')));
    await render(ThemePlayground, { providers });
    await userEvent.click(screen.getByRole('button', { name: 'Copy CSS' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Copy failed.');
  });

  it('explains what to do when there is no clipboard at all', async () => {
    setClipboard(undefined);
    await render(ThemePlayground, { providers });
    await userEvent.click(screen.getByRole('button', { name: 'Copy CSS' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Copy is not available here.');
  });
});
