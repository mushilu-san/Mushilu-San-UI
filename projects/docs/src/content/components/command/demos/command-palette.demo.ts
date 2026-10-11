import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@mushilu-san/ui/overlays';

@Component({
  selector: 'docs-command-palette-demo',
  imports: [Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-command
      placeholder="Type a command or search…"
      (itemActivated)="last.set($event.label)"
    >
      <mui-command-input />
      <mui-command-list>
        <mui-command-empty>No commands match your search.</mui-command-empty>
        <mui-command-group label="Pages">
          <mui-command-item value="home" label="Home">Home</mui-command-item>
          <mui-command-item value="settings" label="Settings">Settings</mui-command-item>
        </mui-command-group>
        <mui-command-group label="Actions">
          <mui-command-item value="new" label="New document" shortcut="⌘N"
            >New document</mui-command-item
          >
        </mui-command-group>
      </mui-command-list>
    </mui-command>
    <p>Last command: {{ last() }}</p>`,
})
export class CommandPaletteDemo {
  protected readonly last = signal('none');
}
