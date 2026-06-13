import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  Signal,
  ViewEncapsulation,
  input,
  model,
  output,
} from '@angular/core';

export interface CommandContext {
  readonly search: Signal<string>;
  setSearch(value: string): void;
  onItemActivated(value: string, label: string): void;
  focusNext(): void;
  focusPrev(): void;
}

export const COMMAND_CONTEXT = new InjectionToken<CommandContext>('COMMAND_CONTEXT');

/**
 * Command — a searchable command palette.
 *
 * Usage:
 *   <mui-command>
 *     <mui-command-input placeholder="Search…" />
 *     <mui-command-empty>No results found.</mui-command-empty>
 *     <mui-command-group label="Actions">
 *       <mui-command-item value="new-file">New file</mui-command-item>
 *       <mui-command-item value="new-folder">New folder</mui-command-item>
 *     </mui-command-group>
 *   </mui-command>
 */
@Component({
  selector: 'mui-command',
  standalone: true,
  templateUrl: './command.html',
  styleUrl: './command.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: COMMAND_CONTEXT,
      /* v8 ignore next 8 -- DI factory body; all lambdas are exercised via tests but V8 misattributes coverage here */
      useFactory: (self: Command, host: ElementRef<HTMLElement>) => ({
        search: self.search,
        setSearch: (v: string) => self.search.set(v),
        onItemActivated: (value: string, label: string) =>
          self.itemActivated.emit({ value, label }),
        focusNext: () => self.moveFocus(1, host.nativeElement),
        focusPrev: () => self.moveFocus(-1, host.nativeElement),
      }),
      deps: [Command, ElementRef],
    },
  ],
  host: { '[attr.part]': '"root"' },
})
export class Command {
  /** The current search string — two-way bindable. */
  search = model('');
  /** Placeholder for the built-in CommandInput (if used without a custom input). */
  placeholder = input('Search…');

  readonly itemActivated = output<{ value: string; label: string }>();

  moveFocus(direction: 1 | -1, host: HTMLElement): void {
    const items = Array.from(
      host.querySelectorAll<HTMLElement>('[data-command-item]:not([aria-disabled="true"])'),
    );
    if (!items.length) return;
    const active = document.activeElement as HTMLElement | null;
    const idx = active ? items.indexOf(active) : -1;
    const next = (idx + direction + items.length) % items.length;
    items[next]?.focus();
  }
}
