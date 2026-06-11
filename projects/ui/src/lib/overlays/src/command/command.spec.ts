import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderTemplate } from '../../../../core/testing';
import { Command } from './command';
import { CommandEmpty } from './command-empty';
import { CommandGroup } from './command-group';
import { CommandInput } from './command-input';
import { CommandItem } from './command-item';
import { CommandList } from './command-list';
import { CommandSeparator } from './command-separator';

const IMPORTS = [Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator];

const BASE = `
  <mui-command>
    <mui-command-input placeholder="Search commands…" />
    <mui-command-list>
      <mui-command-item value="new file">New file</mui-command-item>
      <mui-command-item value="new folder">New folder</mui-command-item>
      <mui-command-item value="open terminal">Open terminal</mui-command-item>
    </mui-command-list>
  </mui-command>
`;

describe('Command', () => {
  it('renders search input', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders all items initially', async () => {
    await renderTemplate(BASE, { imports: IMPORTS });
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('filters items on search input', async () => {
    const user = userEvent.setup();
    await renderTemplate(BASE, { imports: IMPORTS });
    await user.type(screen.getByRole('textbox'), 'file');
    // "new file".includes("file") → visible; "new folder" and "open terminal" → hidden
    const visible = screen.getAllByRole('option');
    expect(visible).toHaveLength(1);
  });

  it('emits itemActivated on item click', async () => {
    const user = userEvent.setup();
    const onActivated = vi.fn();
    await renderTemplate(
      `<mui-command (itemActivated)="onActivated($event)">
        <mui-command-list>
          <mui-command-item value="new-file">New file</mui-command-item>
        </mui-command-list>
      </mui-command>`,
      { imports: IMPORTS, componentProperties: { onActivated } },
    );
    await user.click(screen.getByRole('option', { name: 'New file' }));
    expect(onActivated).toHaveBeenCalledWith({ value: 'new-file', label: 'new-file' });
  });

  it('activates item with Enter key', async () => {
    const user = userEvent.setup();
    const onActivated = vi.fn();
    await renderTemplate(
      `<mui-command (itemActivated)="onActivated($event)">
        <mui-command-list>
          <mui-command-item value="new-file">New file</mui-command-item>
        </mui-command-list>
      </mui-command>`,
      { imports: IMPORTS, componentProperties: { onActivated } },
    );
    screen.getByRole('option', { name: 'New file' }).focus();
    await user.keyboard('{Enter}');
    expect(onActivated).toHaveBeenCalledOnce();
  });

  it('disabled item does not activate', async () => {
    const user = userEvent.setup();
    const onActivated = vi.fn();
    await renderTemplate(
      `<mui-command (itemActivated)="onActivated($event)">
        <mui-command-list>
          <mui-command-item value="disabled-item" [disabled]="true">Disabled</mui-command-item>
        </mui-command-list>
      </mui-command>`,
      { imports: IMPORTS, componentProperties: { onActivated } },
    );
    screen.getByRole('option', { name: 'Disabled' }).click();
    expect(onActivated).not.toHaveBeenCalled();
  });

  it('navigates items with arrow keys from input', async () => {
    const user = userEvent.setup();
    await renderTemplate(BASE, { imports: IMPORTS });
    const input = screen.getByRole('textbox');
    input.focus();
    await user.keyboard('{ArrowDown}');
    // First item should be focused
    const items = screen.getAllByRole('option');
    expect(document.activeElement).toBe(items[0]);
  });

  it('renders group label', async () => {
    await renderTemplate(
      `<mui-command>
        <mui-command-list>
          <mui-command-group label="Files">
            <mui-command-item value="new-file">New file</mui-command-item>
          </mui-command-group>
        </mui-command-list>
      </mui-command>`,
      { imports: IMPORTS },
    );
    expect(screen.getByText('Files')).toBeInTheDocument();
  });
});
