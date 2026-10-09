import { fireEvent, screen } from '@testing-library/angular';
import { afterEach, describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Tooltip } from './tooltip';

afterEach(() => {
  document.querySelectorAll('.mui-tooltip-overlay').forEach((el) => el.remove());
});

describe('Tooltip RTL', () => {
  it('H-S-a3a0cd: overlay carries the trigger dir (rtl)', async () => {
    await renderTemplate('<div dir="rtl"><button [muiTooltip]="\'Save\'">Save</button></div>', {
      imports: [Tooltip],
    });
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Save' }));
    expect(document.querySelector('[role="tooltip"]')).toHaveAttribute('dir', 'rtl');
  });

  it('H-S-a3a0cd: overlay dir is ltr for an ltr trigger', async () => {
    await renderTemplate('<button [muiTooltip]="\'Save\'">Save</button>', { imports: [Tooltip] });
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Save' }));
    expect(document.querySelector('[role="tooltip"]')).toHaveAttribute('dir', 'ltr');
  });

  it('H-S-a3a0cd: placement "start" resolves to the right side in RTL, left in LTR', async () => {
    await renderTemplate(
      `<div dir="rtl"><button id="r" [muiTooltip]="'R'" placement="start">R</button></div>
       <div dir="ltr"><button id="l" [muiTooltip]="'L'" placement="start">L</button></div>`,
      { imports: [Tooltip] },
    );
    const r = screen.getByText('R', { selector: 'button' });
    const l = screen.getByText('L', { selector: 'button' });
    const leftOf = (): number =>
      parseFloat((document.querySelector('[role="tooltip"]') as HTMLElement).style.left);

    fireEvent.mouseEnter(r);
    const rtlLeft = leftOf();
    fireEvent.mouseLeave(r);
    fireEvent.mouseEnter(l);
    const ltrLeft = leftOf();

    // jsdom rects are zero: right side => anchor.right + gap (8); left side clamps to margin (4)
    expect(rtlLeft).toBe(8);
    expect(ltrLeft).toBe(4);
  });
});
