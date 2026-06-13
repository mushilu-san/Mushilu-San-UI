import { fireEvent, screen } from '@testing-library/angular';
import { describe, expect, it, vi } from 'vitest';
import { renderComponent, renderTemplate } from '../../../../core/testing';
import { Toggle } from './toggle';

describe('Toggle', () => {
  it('has role="switch"', async () => {
    await renderTemplate('<mui-toggle label="Notifications"></mui-toggle>', { imports: [Toggle] });
    expect(document.querySelector('mui-toggle')).toHaveAttribute('role', 'switch');
  });

  it('is discoverable by role with aria-label', async () => {
    await renderTemplate('<mui-toggle label="Dark mode"></mui-toggle>', { imports: [Toggle] });
    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeInTheDocument();
  });

  it('defaults to aria-checked="false"', async () => {
    await renderTemplate('<mui-toggle label="X"></mui-toggle>', { imports: [Toggle] });
    expect(document.querySelector('mui-toggle')).toHaveAttribute('aria-checked', 'false');
  });

  it('sets aria-checked="true" when checked', async () => {
    await renderTemplate('<mui-toggle label="X" [checked]="true"></mui-toggle>', {
      imports: [Toggle],
    });
    expect(document.querySelector('mui-toggle')).toHaveAttribute('aria-checked', 'true');
  });

  it('is keyboard focusable by default (tabindex=0)', async () => {
    await renderTemplate('<mui-toggle label="X"></mui-toggle>', { imports: [Toggle] });
    expect(document.querySelector('mui-toggle')).toHaveAttribute('tabindex', '0');
  });

  it('is not focusable when disabled (tabindex=-1)', async () => {
    await renderTemplate('<mui-toggle label="X" disabled></mui-toggle>', { imports: [Toggle] });
    expect(document.querySelector('mui-toggle')).toHaveAttribute('tabindex', '-1');
  });

  it('sets aria-disabled when disabled', async () => {
    await renderTemplate('<mui-toggle label="X" disabled></mui-toggle>', { imports: [Toggle] });
    expect(document.querySelector('mui-toggle')).toHaveAttribute('aria-disabled', 'true');
  });

  it('toggles checked on click', async () => {
    const { detectChanges } = await renderTemplate('<mui-toggle label="X"></mui-toggle>', {
      imports: [Toggle],
    });
    const el = document.querySelector('mui-toggle')!;
    fireEvent.click(el);
    detectChanges();
    expect(el).toHaveAttribute('aria-checked', 'true');
  });

  it('does not toggle when disabled', async () => {
    const { detectChanges } = await renderTemplate('<mui-toggle label="X" disabled></mui-toggle>', {
      imports: [Toggle],
    });
    const el = document.querySelector('mui-toggle')!;
    fireEvent.click(el);
    detectChanges();
    expect(el).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles on Space keydown', async () => {
    const { detectChanges } = await renderTemplate('<mui-toggle label="X"></mui-toggle>', {
      imports: [Toggle],
    });
    const el = document.querySelector('mui-toggle')!;
    fireEvent.keyDown(el, { key: ' ', code: 'Space' });
    detectChanges();
    expect(el).toHaveAttribute('aria-checked', 'true');
  });

  it('renders a track and thumb', async () => {
    await renderComponent(Toggle, {});
    expect(document.querySelector('.track')).toBeTruthy();
    expect(document.querySelector('.thumb')).toBeTruthy();
  });

  it('track is aria-hidden', async () => {
    await renderComponent(Toggle, {});
    expect(document.querySelector('.track')).toHaveAttribute('aria-hidden', 'true');
  });

  it('defaults to md size', async () => {
    await renderTemplate('<mui-toggle label="X"></mui-toggle>', { imports: [Toggle] });
    expect(document.querySelector('mui-toggle')).toHaveAttribute('data-size', 'md');
  });

  it('sets data-checked when checked', async () => {
    await renderTemplate('<mui-toggle label="X" [checked]="true"></mui-toggle>', {
      imports: [Toggle],
    });
    expect(document.querySelector('mui-toggle')).toHaveAttribute('data-checked');
  });

  it('calls onChange when toggled', async () => {
    const { fixture } = await renderComponent(Toggle, { inputs: { label: 'X' } });
    const instance = fixture.componentInstance;
    const onChange = vi.fn();
    instance.registerOnChange(onChange);
    instance.toggle();
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onTouched on blur', async () => {
    const { fixture } = await renderComponent(Toggle, { inputs: { label: 'X' } });
    const instance = fixture.componentInstance;
    const onTouched = vi.fn();
    instance.registerOnTouched(onTouched);
    fireEvent.blur(fixture.nativeElement);
    expect(onTouched).toHaveBeenCalled();
  });

  it('writeValue updates checked state', async () => {
    const { fixture, detectChanges } = await renderComponent(Toggle, { inputs: { label: 'X' } });
    fixture.componentInstance.writeValue(true);
    detectChanges();
    expect(fixture.nativeElement).toHaveAttribute('aria-checked', 'true');
  });

  it('setDisabledState disables toggle', async () => {
    const { fixture, detectChanges } = await renderTemplate('<mui-toggle label="X"></mui-toggle>', {
      imports: [Toggle],
    });
    const el = document.querySelector('mui-toggle')!;
    // CVA disabled state — access via component ref
    const compRef = fixture.debugElement.children[0].componentInstance as Toggle;
    compRef.setDisabledState(true);
    detectChanges();
    expect(el).toHaveAttribute('aria-disabled', 'true');
  });
});
