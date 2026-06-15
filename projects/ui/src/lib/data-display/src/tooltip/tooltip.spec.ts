import { fireEvent, screen } from '@testing-library/angular';
import { afterEach, describe, expect, it } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Tooltip } from './tooltip';

afterEach(() => {
  // Ensure any leaked tooltip elements are cleaned up between tests.
  document.querySelectorAll('.mui-tooltip-overlay').forEach((el) => el.remove());
});

describe('Tooltip', () => {
  it('shows tooltip element on mouseenter', async () => {
    await renderTemplate('<button [muiTooltip]="\'Save file\'">Save</button>', {
      imports: [Tooltip],
    });
    const btn = screen.getByRole('button', { name: 'Save' });
    fireEvent.mouseEnter(btn);
    expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();
    expect(document.querySelector('[role="tooltip"]')!.textContent).toBe('Save file');
  });

  it('hides tooltip on mouseleave', async () => {
    await renderTemplate('<button [muiTooltip]="\'Save file\'">Save</button>', {
      imports: [Tooltip],
    });
    const btn = screen.getByRole('button', { name: 'Save' });
    fireEvent.mouseEnter(btn);
    fireEvent.mouseLeave(btn);
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('shows tooltip on focus', async () => {
    await renderTemplate('<button [muiTooltip]="\'Save file\'">Save</button>', {
      imports: [Tooltip],
    });
    const btn = screen.getByRole('button', { name: 'Save' });
    fireEvent.focus(btn);
    expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();
  });

  it('hides tooltip on blur', async () => {
    await renderTemplate('<button [muiTooltip]="\'Save file\'">Save</button>', {
      imports: [Tooltip],
    });
    const btn = screen.getByRole('button', { name: 'Save' });
    fireEvent.focus(btn);
    fireEvent.blur(btn);
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('hides tooltip on Escape', async () => {
    await renderTemplate('<button [muiTooltip]="\'Save file\'">Save</button>', {
      imports: [Tooltip],
    });
    const btn = screen.getByRole('button', { name: 'Save' });
    fireEvent.mouseEnter(btn);
    fireEvent.keyDown(btn, { key: 'Escape' });
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  it('sets aria-describedby on the trigger when visible', async () => {
    await renderTemplate('<button [muiTooltip]="\'Info\'">Info</button>', {
      imports: [Tooltip],
    });
    const btn = screen.getByRole('button', { name: 'Info' });
    expect(btn).not.toHaveAttribute('aria-describedby');
    fireEvent.mouseEnter(btn);
    const ttId = document.querySelector('[role="tooltip"]')!.id;
    expect(btn).toHaveAttribute('aria-describedby', ttId);
  });

  it('removes aria-describedby when hidden', async () => {
    await renderTemplate('<button [muiTooltip]="\'Info\'">Info</button>', {
      imports: [Tooltip],
    });
    const btn = screen.getByRole('button', { name: 'Info' });
    fireEvent.mouseEnter(btn);
    fireEvent.mouseLeave(btn);
    expect(btn).not.toHaveAttribute('aria-describedby');
  });

  it('tooltip has role=tooltip', async () => {
    await renderTemplate('<button [muiTooltip]="\'Save\'">Save</button>', {
      imports: [Tooltip],
    });
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Save' }));
    expect(document.querySelector('.mui-tooltip-overlay')).toHaveAttribute('role', 'tooltip');
  });

  it('does not show when already visible (idempotent show)', async () => {
    await renderTemplate('<button [muiTooltip]="\'Save\'">Save</button>', {
      imports: [Tooltip],
    });
    const btn = screen.getByRole('button', { name: 'Save' });
    fireEvent.mouseEnter(btn);
    fireEvent.mouseEnter(btn);
    expect(document.querySelectorAll('[role="tooltip"]')).toHaveLength(1);
  });
});
