import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { SkipLink } from './skip-link';

const TEMPLATE = `<a muiSkipLink href="#main">Skip to content</a><main id="main">Content</main>`;

describe('SkipLink', () => {
  it('keeps the link role and its href', async () => {
    await renderTemplate(TEMPLATE, { imports: [SkipLink] });
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
  });

  it('projects translated text', async () => {
    await renderTemplate('<a muiSkipLink href="#main">דלג לתוכן</a><main id="main"></main>', {
      imports: [SkipLink],
    });
    expect(screen.getByRole('link', { name: 'דלג לתוכן' })).toBeInTheDocument();
  });

  it('moves focus to the target on activation', async () => {
    await renderTemplate(TEMPLATE, { imports: [SkipLink] });
    await userEvent.click(screen.getByRole('link', { name: 'Skip to content' }));
    expect(document.getElementById('main')).toHaveFocus();
  });

  it('makes a non-focusable target focusable without overriding an existing tabindex', async () => {
    await renderTemplate(
      `<a muiSkipLink href="#a">A</a><main id="a">x</main><a muiSkipLink href="#b">B</a><div id="b" tabindex="0">y</div>`,
      { imports: [SkipLink] },
    );
    await userEvent.click(screen.getByRole('link', { name: 'A' }));
    expect(document.getElementById('a')).toHaveAttribute('tabindex', '-1');
    await userEvent.click(screen.getByRole('link', { name: 'B' }));
    expect(document.getElementById('b')).toHaveAttribute('tabindex', '0');
  });

  it('prevents the default navigation, so <base href> cannot send the page away', async () => {
    await renderTemplate(TEMPLATE, { imports: [SkipLink] });
    const link = screen.getByRole('link', { name: 'Skip to content' });
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('leaves the click alone when the target does not exist', async () => {
    await renderTemplate('<a muiSkipLink href="#missing">Skip</a>', { imports: [SkipLink] });
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    screen.getByRole('link', { name: 'Skip' }).dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});
