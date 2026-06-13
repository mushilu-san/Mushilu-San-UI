import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Progress } from './progress';

const host = () => document.querySelector('mui-progress')!;

describe('Progress', () => {
  it('exposes role="progressbar" with min/max/now', async () => {
    await renderTemplate('<mui-progress value="30"></mui-progress>', { imports: [Progress] });
    expect(host()).toHaveAttribute('role', 'progressbar');
    expect(host()).toHaveAttribute('aria-valuemin', '0');
    expect(host()).toHaveAttribute('aria-valuemax', '100');
    expect(host()).toHaveAttribute('aria-valuenow', '30');
  });

  it('clamps value to the [0, max] range', async () => {
    await renderTemplate('<mui-progress value="150"></mui-progress>', { imports: [Progress] });
    expect(host()).toHaveAttribute('aria-valuenow', '100');
  });

  it('respects a custom max', async () => {
    await renderTemplate('<mui-progress value="5" max="10"></mui-progress>', {
      imports: [Progress],
    });
    expect(host()).toHaveAttribute('aria-valuemax', '10');
    expect(host()).toHaveAttribute('aria-valuenow', '5');
  });

  it('drops aria-valuenow and sets aria-busy when indeterminate', async () => {
    await renderTemplate('<mui-progress indeterminate></mui-progress>', { imports: [Progress] });
    expect(host()).not.toHaveAttribute('aria-valuenow');
    expect(host()).toHaveAttribute('aria-busy', 'true');
    expect(host()).toHaveAttribute('data-indeterminate');
  });

  it('applies an accessible label', async () => {
    await renderTemplate('<mui-progress value="40" label="Uploading file"></mui-progress>', {
      imports: [Progress],
    });
    expect(host()).toHaveAttribute('aria-label', 'Uploading file');
  });

  it('defaults to the linear variant', async () => {
    await renderTemplate('<mui-progress value="10"></mui-progress>', { imports: [Progress] });
    expect(host()).toHaveAttribute('data-variant', 'linear');
    expect(document.querySelector('.mui-progress__bar')).toBeTruthy();
  });

  it('renders an SVG indicator for the circular variant', async () => {
    await renderTemplate('<mui-progress variant="circular" value="60"></mui-progress>', {
      imports: [Progress],
    });
    expect(host()).toHaveAttribute('data-variant', 'circular');
    expect(document.querySelector('.mui-progress__circle')).toBeTruthy();
  });

  it('reflects size as data-size', async () => {
    await renderTemplate('<mui-progress size="lg" value="20"></mui-progress>', {
      imports: [Progress],
    });
    expect(host()).toHaveAttribute('data-size', 'lg');
  });
});
