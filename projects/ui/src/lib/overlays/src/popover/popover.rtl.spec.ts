import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Popover } from './popover';
import { PopoverTrigger } from './popover-trigger';

const imports = [Popover, PopoverTrigger];

describe('Popover RTL', () => {
  it('H-A-59dfb4: bottom-start panel renders under dir=rtl with its logical placement attribute', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<div dir="rtl"><mui-popover placement="bottom-start">
         <button muiPopoverTrigger>Open</button><p>Content</p>
       </mui-popover></div>`,
      { imports },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const panel = screen.getByRole('dialog');
    expect(panel).toHaveAttribute('data-placement', 'bottom-start');
    expect(panel.closest('[dir]')).toHaveAttribute('dir', 'rtl');
  });

  it('H-T-b77469: logical "end" placement is accepted and exposed to CSS', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<div dir="rtl"><mui-popover placement="end">
         <button muiPopoverTrigger>Open</button><p>Content</p>
       </mui-popover></div>`,
      { imports },
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('data-placement', 'end');
  });
});
