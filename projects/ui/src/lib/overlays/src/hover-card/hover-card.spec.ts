import { screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { HoverCard } from './hover-card';
import { HoverCardContent } from './hover-card-content';
import { HoverCardTrigger } from './hover-card-trigger';

const IMPORTS = [HoverCard, HoverCardTrigger, HoverCardContent];

const BASE = `
  <mui-hover-card [openDelay]="0" [closeDelay]="0">
    <a muiHoverCardTrigger href="#" data-testid="trigger">Hover me</a>
    <mui-hover-card-content><p>Card content</p></mui-hover-card-content>
  </mui-hover-card>
`;

describe('HoverCard', () => {
  it('panel is hidden by default', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows panel on mouseenter', async () => {
    const user = userEvent.setup();
    await renderTemplate(BASE, { imports: IMPORTS });
    await user.hover(screen.getByTestId('trigger'));
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
  });

  it('hides panel on mouseleave', async () => {
    const user = userEvent.setup();
    await renderTemplate(BASE, { imports: IMPORTS });
    await user.hover(screen.getByTestId('trigger'));
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    await user.unhover(screen.getByTestId('trigger'));
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('shows panel on focus', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    screen.getByTestId('trigger').focus();
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
  });

  it('hides panel on blur', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    screen.getByTestId('trigger').focus();
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    screen.getByTestId('trigger').blur();
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('projects content into panel', async () => {
    const user = userEvent.setup();
    await renderTemplate(BASE, { imports: IMPORTS });
    await user.hover(screen.getByTestId('trigger'));
    await waitFor(() => expect(screen.getByText('Card content')).toBeInTheDocument());
  });

  it('emits opened event when card opens', async () => {
    const user = userEvent.setup();
    const onOpened = vi.fn();
    await renderTemplate(
      `<mui-hover-card [openDelay]="0" (opened)="onOpened()">
        <a muiHoverCardTrigger href="#" data-testid="t">Hover</a>
        <mui-hover-card-content>Content</mui-hover-card-content>
      </mui-hover-card>`,
      { imports: IMPORTS, componentProperties: { onOpened } },
    );
    await user.hover(screen.getByTestId('t'));
    await waitFor(() => expect(onOpened).toHaveBeenCalledOnce());
  });

  it('emits closed event when card closes', async () => {
    const user = userEvent.setup();
    const onClosed = vi.fn();
    await renderTemplate(
      `<mui-hover-card [openDelay]="0" [closeDelay]="0" (closed)="onClosed()">
        <a muiHoverCardTrigger href="#" data-testid="t">Hover</a>
        <mui-hover-card-content>Content</mui-hover-card-content>
      </mui-hover-card>`,
      { imports: IMPORTS, componentProperties: { onClosed } },
    );
    await user.hover(screen.getByTestId('t'));
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    await user.unhover(screen.getByTestId('t'));
    await waitFor(() => expect(onClosed).toHaveBeenCalledOnce());
  });
});
