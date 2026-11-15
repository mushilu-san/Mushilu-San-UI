import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Chip } from './chip';

describe('Chip', () => {
  it('a link chip keeps the link role and href', async () => {
    await renderTemplate('<a muiChip href="/tags/angular">angular</a>', { imports: [Chip] });
    expect(screen.getByRole('link', { name: 'angular' })).toHaveAttribute('href', '/tags/angular');
  });

  it('a link chip marks the current page with aria-current when selected', async () => {
    await renderTemplate('<a muiChip href="/x" selected>x</a>', { imports: [Chip] });
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-pressed');
  });

  it('a link chip without selected has no aria-current', async () => {
    await renderTemplate('<a muiChip href="/x">x</a>', { imports: [Chip] });
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
  });

  it('a button chip is a toggle only when selected is bound', async () => {
    await renderTemplate(
      '<button muiChip [selected]="on" (click)="on = !on">a</button><button muiChip>b</button>',
      { imports: [Chip], componentProperties: { on: false } },
    );
    const toggle = screen.getByRole('button', { name: 'a' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'b' })).not.toHaveAttribute('aria-pressed');
  });

  it('a button chip reports aria-pressed true when selected', async () => {
    await renderTemplate('<button muiChip [selected]="true">a</button>', { imports: [Chip] });
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button')).toHaveAttribute('data-selected');
  });

  it('a button chip is clickable', async () => {
    const onClick = vi.fn();
    await renderTemplate('<button muiChip (click)="c()">a</button>', {
      imports: [Chip],
      componentProperties: { c: onClick },
    });
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('shows leading text hidden from assistive technology', async () => {
    await renderTemplate('<a muiChip href="/x" leading="#">angular</a>', { imports: [Chip] });
    const leading = document.querySelector('.mui-chip__leading');
    expect(leading).toHaveTextContent('#');
    expect(leading).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('link', { name: 'angular' })).toBeInTheDocument();
  });

  it('mui-chip is a plain non-interactive pill', async () => {
    await renderTemplate('<mui-chip selected>static</mui-chip>', { imports: [Chip] });
    const host = document.querySelector('mui-chip') as HTMLElement;
    expect(host).not.toHaveAttribute('data-interactive');
    expect(host).not.toHaveAttribute('aria-pressed');
    expect(host).not.toHaveAttribute('aria-current');
    expect(host).toHaveAttribute('data-selected');
  });
});
