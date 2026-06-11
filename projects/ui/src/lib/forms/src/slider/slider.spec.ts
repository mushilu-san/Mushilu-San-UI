import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
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
});
