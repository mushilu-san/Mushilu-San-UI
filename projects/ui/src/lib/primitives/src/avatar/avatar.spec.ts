import { fireEvent, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Avatar } from './avatar';

describe('Avatar', () => {
  it('has role="img"', async () => {
    await renderTemplate('<mui-avatar name="Jane Doe" label="Jane Doe"></mui-avatar>', {
      imports: [Avatar],
    });
    expect(document.querySelector('mui-avatar')).toHaveAttribute('role', 'img');
  });

  it('is discoverable by role with aria-label', async () => {
    await renderTemplate('<mui-avatar name="Jane Doe" label="Jane Doe avatar"></mui-avatar>', {
      imports: [Avatar],
    });
    expect(screen.getByRole('img', { name: 'Jane Doe avatar' })).toBeInTheDocument();
  });

  it('sets aria-label from label input', async () => {
    await renderTemplate('<mui-avatar label="Profile photo"></mui-avatar>', { imports: [Avatar] });
    expect(document.querySelector('mui-avatar')).toHaveAttribute('aria-label', 'Profile photo');
  });

  it('shows initials when no src', async () => {
    await renderComponent(Avatar, { inputs: { name: 'Jane Doe' } });
    expect(document.querySelector('.fallback')?.textContent?.trim()).toBe('JD');
  });

  it('uses single initial for one-word name', async () => {
    await renderComponent(Avatar, { inputs: { name: 'Alice' } });
    expect(document.querySelector('.fallback')?.textContent?.trim()).toBe('A');
  });

  it('shows fallback "?" when name is empty', async () => {
    await renderComponent(Avatar, {});
    expect(document.querySelector('.fallback')?.textContent?.trim()).toBe('?');
  });

  it('renders an img when src is provided', async () => {
    await renderComponent(Avatar, { inputs: { src: 'https://example.com/a.jpg', name: 'Jane' } });
    expect(document.querySelector('img.image')).toBeTruthy();
  });

  it('img has aria-hidden to prevent double announcement', async () => {
    await renderComponent(Avatar, { inputs: { src: 'https://example.com/a.jpg', name: 'Jane' } });
    expect(document.querySelector('img.image')).toHaveAttribute('aria-hidden', 'true');
  });

  it('reflects size as data-size attribute', async () => {
    await renderTemplate('<mui-avatar size="lg" name="A"></mui-avatar>', { imports: [Avatar] });
    expect(document.querySelector('mui-avatar')).toHaveAttribute('data-size', 'lg');
  });

  it('defaults to md size', async () => {
    await renderTemplate('<mui-avatar name="A"></mui-avatar>', { imports: [Avatar] });
    expect(document.querySelector('mui-avatar')).toHaveAttribute('data-size', 'md');
  });

  it('reflects shape as data-shape attribute', async () => {
    await renderTemplate('<mui-avatar shape="square" name="A"></mui-avatar>', {
      imports: [Avatar],
    });
    expect(document.querySelector('mui-avatar')).toHaveAttribute('data-shape', 'square');
  });

  it('defaults to circle shape', async () => {
    await renderTemplate('<mui-avatar name="A"></mui-avatar>', { imports: [Avatar] });
    expect(document.querySelector('mui-avatar')).toHaveAttribute('data-shape', 'circle');
  });

  it('shows fallback when src is absent', async () => {
    await renderComponent(Avatar, { inputs: { name: 'Bob Smith' } });
    expect(document.querySelector('.fallback')).toBeTruthy();
    expect(document.querySelector('img.image')).toBeFalsy();
  });

  it('falls back to initials when image errors', async () => {
    const { detectChanges } = await renderComponent(Avatar, {
      inputs: { src: 'https://broken.invalid/x.jpg', name: 'Jane Doe' },
    });
    const img = document.querySelector('img.image')!;
    expect(img).toBeTruthy();
    fireEvent.error(img);
    detectChanges();
    expect(document.querySelector('img.image')).toBeFalsy();
    expect(document.querySelector('.fallback')?.textContent?.trim()).toBe('JD');
  });
});
