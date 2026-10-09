import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Slider } from './slider';

async function render(dir: 'rtl' | 'ltr') {
  await renderTemplate(`<div dir="${dir}"><mui-slider [value]="50"></mui-slider></div>`, {
    imports: [Slider],
  });
  return screen.getByRole('slider');
}

function mockTrack(): HTMLElement {
  const track = document.querySelector('.slider-track') as HTMLElement;
  vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    right: 200,
    width: 200,
    top: 0,
    bottom: 6,
    height: 6,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
  track.setPointerCapture = vi.fn();
  return track;
}

describe('Slider RTL', () => {
  it('H-B-4a98b0: ArrowLeft increases and ArrowRight decreases in RTL', async () => {
    const user = userEvent.setup();
    const thumb = await render('rtl');
    thumb.focus();
    await user.keyboard('{ArrowLeft}');
    expect(thumb).toHaveAttribute('aria-valuenow', '51');
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '49');
  });

  it('H-B-4a98b0: LTR key mapping unchanged', async () => {
    const user = userEvent.setup();
    const thumb = await render('ltr');
    thumb.focus();
    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '51');
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(thumb).toHaveAttribute('aria-valuenow', '49');
  });

  it('H-B-4a98b0: Up/Down/Home/End unchanged in RTL', async () => {
    const user = userEvent.setup();
    const thumb = await render('rtl');
    thumb.focus();
    await user.keyboard('{ArrowUp}');
    expect(thumb).toHaveAttribute('aria-valuenow', '51');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(thumb).toHaveAttribute('aria-valuenow', '49');
    await user.keyboard('{Home}');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
    await user.keyboard('{End}');
    expect(thumb).toHaveAttribute('aria-valuenow', '100');
  });

  it('H-B-4a98b0: pointer ratio is mirrored in RTL', async () => {
    const thumb = await render('rtl');
    const track = mockTrack();
    // clientX 50 of 200 = 25% from the left = 75% from the inline-start (right) edge
    fireEvent.pointerDown(track, { clientX: 50, pointerId: 1 });
    expect(thumb).toHaveAttribute('aria-valuenow', '75');
  });

  it('H-B-4a98b0: pointer ratio unchanged in LTR', async () => {
    const thumb = await render('ltr');
    const track = mockTrack();
    fireEvent.pointerDown(track, { clientX: 50, pointerId: 1 });
    expect(thumb).toHaveAttribute('aria-valuenow', '25');
  });

  it('H-B-4a98b0: thumb positioned via inset-inline-start, not left', async () => {
    const thumb = await render('rtl');
    expect(thumb.getAttribute('style')).toContain('50%');
    expect(thumb.style.left).toBe('');
  });
});
