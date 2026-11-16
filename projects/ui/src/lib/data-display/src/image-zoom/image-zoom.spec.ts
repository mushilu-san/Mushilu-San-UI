import { fireEvent, screen } from '@testing-library/angular';
import { beforeAll, describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { ImageZoom } from './image-zoom';

// jsdom has no <dialog> modal support.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  };
});

const tpl = '<mui-image-zoom src="/a.jpg" alt="A cert" caption="Issued 2026" />';

describe('ImageZoom', () => {
  it('renders a trigger button named with the enlarge label and alt', async () => {
    await renderTemplate(tpl, { imports: [ImageZoom] });
    const btn = screen.getByRole('button', { name: 'Enlarge image: A cert' });
    expect(btn).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('thumbnail is decorative inside the labelled button', async () => {
    await renderTemplate(tpl, { imports: [ImageZoom] });
    expect(document.querySelector('.thumb')).toHaveAttribute('alt', '');
  });

  it('opens the dialog with the full image and caption', async () => {
    await renderTemplate(
      '<mui-image-zoom src="/a.jpg" fullSrc="/big.jpg" alt="A" caption="Cap" />',
      {
        imports: [ImageZoom],
      },
    );
    fireEvent.click(document.querySelector('.trigger')!);
    const dialog = document.querySelector('dialog')!;
    expect(dialog).toHaveAttribute('open');
    expect(dialog.querySelector('.full')).toHaveAttribute('src', '/big.jpg');
    expect(dialog.querySelector('.full')).toHaveAttribute('alt', 'A');
    expect(dialog.querySelector('figcaption')?.textContent).toBe('Cap');
  });

  it('falls back to src and omits the caption when unset', async () => {
    await renderTemplate('<mui-image-zoom src="/a.jpg" alt="A" />', { imports: [ImageZoom] });
    expect(document.querySelector('.full')).toHaveAttribute('src', '/a.jpg');
    expect(document.querySelector('figcaption')).toBeNull();
  });

  it('closes via the close button', async () => {
    await renderTemplate(tpl, { imports: [ImageZoom] });
    fireEvent.click(document.querySelector('.trigger')!);
    fireEvent.click(document.querySelector('.close')!);
    expect(document.querySelector('dialog')).not.toHaveAttribute('open');
  });

  it('closes when the backdrop is pressed but not when content is', async () => {
    await renderTemplate(tpl, { imports: [ImageZoom] });
    fireEvent.click(document.querySelector('.trigger')!);
    const dialog = document.querySelector('dialog')!;
    fireEvent.pointerDown(dialog.querySelector('.full')!);
    expect(dialog).toHaveAttribute('open');
    fireEvent.pointerDown(dialog);
    expect(dialog).not.toHaveAttribute('open');
  });

  it('labels dialog and close button with translatable text', async () => {
    await renderTemplate(
      '<mui-image-zoom src="/a.jpg" alt="A" enlargeLabel="הגדל" closeLabel="סגור" />',
      { imports: [ImageZoom] },
    );
    expect(screen.getByRole('button', { name: 'הגדל: A' })).toBeInTheDocument();
    expect(document.querySelector('.close')?.textContent).toBe('סגור');
    expect(document.querySelector('dialog')).toHaveAttribute('aria-label', 'A');
  });
});
