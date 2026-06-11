import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { ToggleGroup } from './toggle-group';
import { ToggleGroupItem } from './toggle-group-item';

const IMPORTS = [ToggleGroup, ToggleGroupItem];

describe('ToggleGroup (single)', () => {
  it('renders items as buttons with role button', async () => {
    await renderTemplate(
      `<mui-toggle-group>
        <mui-toggle-group-item value="a">A</mui-toggle-group-item>
        <mui-toggle-group-item value="b">B</mui-toggle-group-item>
      </mui-toggle-group>`,
      { imports: IMPORTS },
    );
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('has aria-pressed=false for unselected items', async () => {
    await renderTemplate(
      `<mui-toggle-group value="">
        <mui-toggle-group-item value="a">A</mui-toggle-group-item>
      </mui-toggle-group>`,
      { imports: IMPORTS },
    );
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('has aria-pressed=true for the selected item', async () => {
    await renderTemplate(
      `<mui-toggle-group value="a">
        <mui-toggle-group-item value="a">A</mui-toggle-group-item>
        <mui-toggle-group-item value="b">B</mui-toggle-group-item>
      </mui-toggle-group>`,
      { imports: IMPORTS },
    );
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('selects item on click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    await renderTemplate(
      `<mui-toggle-group [(value)]="val" (valueChange)="onValueChange($event)">
        <mui-toggle-group-item value="a">A</mui-toggle-group-item>
        <mui-toggle-group-item value="b">B</mui-toggle-group-item>
      </mui-toggle-group>`,
      { imports: IMPORTS, componentProperties: { val: '', onValueChange } },
    );
    await user.click(screen.getByRole('button', { name: 'A' }));
    expect(onValueChange).toHaveBeenCalledWith('a');
  });

  it('deselects already-selected item on click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    await renderTemplate(
      `<mui-toggle-group [(value)]="val" (valueChange)="onValueChange($event)">
        <mui-toggle-group-item value="a">A</mui-toggle-group-item>
      </mui-toggle-group>`,
      { imports: IMPORTS, componentProperties: { val: 'a', onValueChange } },
    );
    await user.click(screen.getByRole('button', { name: 'A' }));
    expect(onValueChange).toHaveBeenCalledWith('');
  });
});

describe('ToggleGroup (multiple)', () => {
  it('can select multiple items', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    await renderTemplate(
      `<mui-toggle-group type="multiple" [(value)]="val" (valueChange)="onValueChange($event)">
        <mui-toggle-group-item value="bold">Bold</mui-toggle-group-item>
        <mui-toggle-group-item value="italic">Italic</mui-toggle-group-item>
        <mui-toggle-group-item value="underline">Underline</mui-toggle-group-item>
      </mui-toggle-group>`,
      { imports: IMPORTS, componentProperties: { val: '', onValueChange } },
    );
    await user.click(screen.getByRole('button', { name: 'Bold' }));
    await user.click(screen.getByRole('button', { name: 'Italic' }));
    expect(onValueChange).toHaveBeenLastCalledWith('bold,italic');
  });

  it('deselects individual items in multiple mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    await renderTemplate(
      `<mui-toggle-group type="multiple" [(value)]="val" (valueChange)="onValueChange($event)">
        <mui-toggle-group-item value="bold">Bold</mui-toggle-group-item>
        <mui-toggle-group-item value="italic">Italic</mui-toggle-group-item>
      </mui-toggle-group>`,
      { imports: IMPORTS, componentProperties: { val: 'bold,italic', onValueChange } },
    );
    await user.click(screen.getByRole('button', { name: 'Bold' }));
    expect(onValueChange).toHaveBeenCalledWith('italic');
  });
});

describe('ToggleGroup (disabled)', () => {
  it('sets aria-disabled on group-disabled items', async () => {
    await renderTemplate(
      `<mui-toggle-group [disabled]="true">
        <mui-toggle-group-item value="a">A</mui-toggle-group-item>
      </mui-toggle-group>`,
      { imports: IMPORTS },
    );
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('sets aria-disabled on individually-disabled item', async () => {
    await renderTemplate(
      `<mui-toggle-group>
        <mui-toggle-group-item value="a" [disabled]="true">A</mui-toggle-group-item>
        <mui-toggle-group-item value="b">B</mui-toggle-group-item>
      </mui-toggle-group>`,
      { imports: IMPORTS },
    );
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'B' })).not.toHaveAttribute('aria-disabled');
  });

  it('does not select disabled item on click', async () => {
    const onValueChange = vi.fn();
    await renderTemplate(
      `<mui-toggle-group [(value)]="val" (valueChange)="onValueChange($event)">
        <mui-toggle-group-item value="a" [disabled]="true">A</mui-toggle-group-item>
      </mui-toggle-group>`,
      { imports: IMPORTS, componentProperties: { val: '', onValueChange } },
    );
    // fireEvent bypasses pointer-events:none
    const btn = screen.getByRole('button', { name: 'A' });
    btn.click();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('ToggleGroup (keyboard)', () => {
  it('selects item with Space key', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    await renderTemplate(
      `<mui-toggle-group [(value)]="val" (valueChange)="onValueChange($event)">
        <mui-toggle-group-item value="a">A</mui-toggle-group-item>
      </mui-toggle-group>`,
      { imports: IMPORTS, componentProperties: { val: '', onValueChange } },
    );
    screen.getByRole('button', { name: 'A' }).focus();
    await user.keyboard(' ');
    expect(onValueChange).toHaveBeenCalledWith('a');
  });
});

describe('ToggleGroup (a11y)', () => {
  it('has role=group on container', async () => {
    await renderTemplate(
      `<mui-toggle-group>
        <mui-toggle-group-item value="a">A</mui-toggle-group-item>
      </mui-toggle-group>`,
      { imports: IMPORTS },
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
  });
});
