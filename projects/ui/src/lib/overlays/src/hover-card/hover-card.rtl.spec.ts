import { screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { HoverCard } from './hover-card';
import { HoverCardContent } from './hover-card-content';
import { HoverCardTrigger } from './hover-card-trigger';

const imports = [HoverCard, HoverCardTrigger, HoverCardContent];

describe('HoverCard RTL', () => {
  it('H-A-2c0164: bottom-end panel renders under dir=rtl with logical placement attribute', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<div dir="rtl"><mui-hover-card [openDelay]="0" [closeDelay]="0" placement="bottom-end">
         <a muiHoverCardTrigger href="#" data-testid="t">Hover</a>
         <mui-hover-card-content><p>Card</p></mui-hover-card-content>
       </mui-hover-card></div>`,
      { imports },
    );
    await user.hover(screen.getByTestId('t'));
    const panel = await waitFor(() => screen.getByRole('tooltip'));
    expect(panel).toHaveAttribute('data-placement', 'bottom-end');
    expect(panel.closest('[dir]')).toHaveAttribute('dir', 'rtl');
  });

  it('H-A-2c0164: logical "start" placement is accepted', async () => {
    const user = userEvent.setup();
    await renderTemplate(
      `<div dir="rtl"><mui-hover-card [openDelay]="0" [closeDelay]="0" placement="start">
         <a muiHoverCardTrigger href="#" data-testid="t">Hover</a>
         <mui-hover-card-content><p>Card</p></mui-hover-card-content>
       </mui-hover-card></div>`,
      { imports },
    );
    await user.hover(screen.getByTestId('t'));
    const panel = await waitFor(() => screen.getByRole('tooltip'));
    expect(panel).toHaveAttribute('data-placement', 'start');
  });
});
