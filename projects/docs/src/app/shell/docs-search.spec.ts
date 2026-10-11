import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideMushiluUi } from '@mushilu-san/ui';
import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { DOCS_REGISTRY } from '../../content/tokens';
import type { RegistryEntry } from '../../content/types';
import { DocsSearch } from './docs-search';

const entries = [
  { slug: 'button', name: 'Button', group: 'primitives', summary: '', load: async () => ({}) },
  { slug: 'dialog', name: 'Dialog', group: 'feedback', summary: '', load: async () => ({}) },
] as unknown as RegistryEntry[];

const providers = [
  provideMushiluUi(),
  provideRouter([]),
  { provide: DOCS_REGISTRY, useValue: entries },
];

describe('DocsSearch', () => {
  beforeAll(() => {
    // jsdom does not implement the native <dialog> modal API.
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    };
  });

  it('opens the search dialog with Ctrl+K', async () => {
    await render(DocsSearch, { providers });
    expect(screen.queryByRole('option', { name: 'Button' })).not.toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(await screen.findByRole('option', { name: 'Button' })).toBeInTheDocument();
  });

  it('toggles the dialog with Cmd+K as well', async () => {
    await render(DocsSearch, { providers });
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(await screen.findByRole('option', { name: 'Dialog' })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(screen.queryByRole('option', { name: 'Dialog' })).not.toBeInTheDocument();
  });

  it('ignores plain k presses', async () => {
    await render(DocsSearch, { providers });
    fireEvent.keyDown(document, { key: 'k' });
    expect(screen.queryByRole('option', { name: 'Button' })).not.toBeInTheDocument();
  });

  it('navigates to the chosen component page', async () => {
    await render(DocsSearch, { providers });
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    await userEvent.click(await screen.findByRole('option', { name: 'Button' }));
    expect(navigate).toHaveBeenCalledWith('/components/button');
  });
});
