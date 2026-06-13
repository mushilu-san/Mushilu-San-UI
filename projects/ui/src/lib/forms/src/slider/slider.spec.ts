import { fireEvent, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Slider } from './slider';

describe('Slider', () => {
  it('renders a slider role', async () => {
    await renderComponent(Slider, { inputs: { value: 40 } });
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('sets aria-valuenow from value input', async () => {
    await renderComponent(Slider, { inputs: { value: 40 } });
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '40');
  });

  it('sets aria-valuemin and aria-valuemax', async () => {
    await renderComponent(Slider, { inputs: { min: 10, max: 90, value: 50 } });
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuemin', '10');
    expect(thumb).toHaveAttribute('aria-valuemax', '90');
  });

  it('defaults to value 0, min 0, max 100', async () => {
    await renderComponent(Slider, {});
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
    expect(thumb).toHaveAttribute('aria-valuemin', '0');
    expect(thumb).toHaveAttribute('aria-valuemax', '100');
  });

  it('increments value with ArrowRight', async () => {
    const user = userEvent.setup();
    await renderComponent(Slider, { inputs: { value: 50, step: 10 } });
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '60');
  });

  it('decrements value with ArrowLeft', async () => {
    const user = userEvent.setup();
    await renderComponent(Slider, { inputs: { value: 50, step: 10 } });
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{ArrowLeft}');
    expect(thumb).toHaveAttribute('aria-valuenow', '40');
  });

  it('jumps to max with End key', async () => {
    const user = userEvent.setup();
    await renderComponent(Slider, { inputs: { value: 50 } });
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{End}');
    expect(thumb).toHaveAttribute('aria-valuenow', '100');
  });

  it('jumps to min with Home key', async () => {
    const user = userEvent.setup();
    await renderComponent(Slider, { inputs: { value: 50 } });
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{Home}');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
  });

  it('does not exceed max', async () => {
    const user = userEvent.setup();
    await renderComponent(Slider, { inputs: { value: 100 } });
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '100');
  });

  it('does not go below min', async () => {
    const user = userEvent.setup();
    await renderComponent(Slider, { inputs: { value: 0 } });
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{ArrowLeft}');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
  });

  it('sets aria-disabled when disabled', async () => {
    await renderComponent(Slider, { inputs: { disabled: true } });
    expect(screen.getByRole('slider')).toHaveAttribute('aria-disabled');
  });

  it('sets tabindex=-1 when disabled', async () => {
    await renderComponent(Slider, { inputs: { disabled: true } });
    expect(screen.getByRole('slider')).toHaveAttribute('tabindex', '-1');
  });

  it('does not respond to keyboard when disabled', async () => {
    const user = userEvent.setup();
    await renderComponent(Slider, { inputs: { value: 50, disabled: true } });
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '50');
  });

  it('sets data-disabled on host', async () => {
    await renderTemplate(`<mui-slider [disabled]="true"></mui-slider>`, { imports: [Slider] });
    expect(document.querySelector('mui-slider')).toHaveAttribute('data-disabled');
  });

  it('is focusable by keyboard', async () => {
    await renderTemplate(`<mui-slider></mui-slider>`, { imports: [Slider] });
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('tabindex', '0');
  });

  it('increments value with ArrowUp', async () => {
    const user = userEvent.setup();
    await renderComponent(Slider, { inputs: { value: 50, step: 10 } });
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{ArrowUp}');
    expect(thumb).toHaveAttribute('aria-valuenow', '60');
  });

  it('decrements value with ArrowDown', async () => {
    const user = userEvent.setup();
    await renderComponent(Slider, { inputs: { value: 50, step: 10 } });
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{ArrowDown}');
    expect(thumb).toHaveAttribute('aria-valuenow', '40');
  });

  it('increases value by 10% of range with PageUp', async () => {
    const user = userEvent.setup();
    // min=0, max=100 → big step = 10
    await renderComponent(Slider, { inputs: { value: 50, min: 0, max: 100 } });
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{PageUp}');
    expect(thumb).toHaveAttribute('aria-valuenow', '60');
  });

  it('decreases value by 10% of range with PageDown', async () => {
    const user = userEvent.setup();
    await renderComponent(Slider, { inputs: { value: 50, min: 0, max: 100 } });
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{PageDown}');
    expect(thumb).toHaveAttribute('aria-valuenow', '40');
  });

  it('PageUp clamps to max', async () => {
    const user = userEvent.setup();
    await renderComponent(Slider, { inputs: { value: 95, min: 0, max: 100 } });
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{PageUp}');
    expect(thumb).toHaveAttribute('aria-valuenow', '100');
  });

  it('PageDown clamps to min', async () => {
    const user = userEvent.setup();
    await renderComponent(Slider, { inputs: { value: 5, min: 0, max: 100 } });
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{PageDown}');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
  });

  it('sets value from pointer position on track click', async () => {
    const { fixture, detectChanges } = await renderComponent(Slider, {
      inputs: { value: 0, min: 0, max: 100 },
    });
    const track = fixture.nativeElement.querySelector('.slider-track') as HTMLElement;
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      right: 200,
      width: 200,
      top: 0,
      bottom: 20,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
    track.setPointerCapture = vi.fn();

    // clientX=100 on a 200px track → ratio=0.5 → value=50
    fireEvent.pointerDown(track, { clientX: 100, pointerId: 1 });
    detectChanges();

    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '50');
  });

  it('updates value on pointer move with button held', async () => {
    const { fixture, detectChanges } = await renderComponent(Slider, {
      inputs: { value: 0, min: 0, max: 100 },
    });
    const track = fixture.nativeElement.querySelector('.slider-track') as HTMLElement;
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      right: 100,
      width: 100,
      top: 0,
      bottom: 20,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
    track.setPointerCapture = vi.fn();

    fireEvent.pointerDown(track, { clientX: 0, pointerId: 1 });
    // Move to 75% of 100px track → value=75
    fireEvent.pointerMove(track, { clientX: 75, buttons: 1 });
    detectChanges();

    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '75');
  });

  it('ignores pointer move when no button held (buttons === 0)', async () => {
    const { fixture, detectChanges } = await renderComponent(Slider, {
      inputs: { value: 30, min: 0, max: 100 },
    });
    const track = fixture.nativeElement.querySelector('.slider-track') as HTMLElement;
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      right: 100,
      width: 100,
      top: 0,
      bottom: 20,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    fireEvent.pointerMove(track, { clientX: 80, buttons: 0 });
    detectChanges();

    // value unchanged
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '30');
  });

  it('onBlur triggers registered onTouched callback', async () => {
    const { fixture } = await renderComponent(Slider, { inputs: { value: 50 } });
    const onTouched = vi.fn();
    fixture.componentInstance.registerOnTouched(onTouched);
    fireEvent.blur(screen.getByRole('slider'));
    expect(onTouched).toHaveBeenCalledOnce();
  });

  it('writeValue(null) resets value to 0', async () => {
    const { fixture, detectChanges } = await renderComponent(Slider, { inputs: { value: 50 } });
    fixture.componentInstance.writeValue(null as unknown as number);
    detectChanges();
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0');
  });

  it('registerOnChange callback fires when value changes via keyboard', async () => {
    const user = userEvent.setup();
    const { fixture } = await renderComponent(Slider, { inputs: { value: 50, step: 10 } });
    const onChange = vi.fn();
    fixture.componentInstance.registerOnChange(onChange);
    screen.getByRole('slider').focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(60);
  });

  it('setDisabledState disables slider via CVA', async () => {
    const { fixture, detectChanges } = await renderComponent(Slider, { inputs: { value: 50 } });
    fixture.componentInstance.setDisabledState(true);
    detectChanges();
    expect(screen.getByRole('slider')).toHaveAttribute('aria-disabled');
  });

  it('fillPercent is 0 when max equals min (no division by zero)', async () => {
    const { fixture } = await renderComponent(Slider, {
      inputs: { value: 5, min: 5, max: 5 },
    });
    // fillPercent = 0 → thumb left style should be 0%
    const thumb = fixture.nativeElement.querySelector('.slider-thumb') as HTMLElement;
    expect(thumb.style.left).toBe('0%');
  });

  it('rounds floating-point values correctly', async () => {
    const user = userEvent.setup();
    // step=0.1, value=0.1 → ArrowRight → 0.2 (not 0.30000000000000004)
    await renderComponent(Slider, { inputs: { value: 0.1, step: 0.1, min: 0, max: 1 } });
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '0.2');
  });

  afterEach(() => vi.restoreAllMocks());
});
