import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Dialog } from '@mushilu-san/ui/feedback';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@mushilu-san/ui/overlays';
import { Button } from '@mushilu-san/ui/primitives';
import { GROUPS } from '../../content/groups';
import { DOCS_REGISTRY } from '../../content/tokens';

/**
 * Search for component pages. Opens with Ctrl+K or Cmd+K from anywhere on the site, and with the
 * header button. Choosing a result navigates to that component page.
 */
@Component({
  selector: 'docs-search',
  imports: [
    Dialog,
    Command,
    CommandInput,
    CommandList,
    CommandGroup,
    CommandItem,
    CommandEmpty,
    Button,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: contents;
    }
    .trigger {
      min-height: var(--mui-touch-target);
    }
    .trigger .hint {
      margin-inline-start: var(--mui-space-2);
      color: var(--mui-color-text-muted);
      font-size: var(--mui-font-size-xs);
    }
    @media (max-width: 639px) {
      .trigger .hint {
        display: none;
      }
    }
  `,
  template: `
    <button
      muiButton
      variant="ghost"
      type="button"
      class="trigger"
      aria-keyshortcuts="Control+K Meta+K"
      aria-haspopup="dialog"
      [attr.aria-expanded]="open()"
      (clicked)="open.set(true)"
    >
      Search
      <span class="hint" aria-hidden="true">Ctrl K</span>
    </button>

    <mui-dialog heading="Search components" size="md" [(open)]="open">
      <mui-command placeholder="Search components…" (itemActivated)="go($event.value)">
        <mui-command-input />
        <mui-command-list>
          <mui-command-empty>No components match your search.</mui-command-empty>
          @for (group of groups; track group.id) {
            <mui-command-group [label]="group.label">
              @for (entry of entriesFor(group.id); track entry.slug) {
                <mui-command-item [value]="entry.slug">{{ entry.name }}</mui-command-item>
              }
            </mui-command-group>
          }
        </mui-command-list>
      </mui-command>
    </mui-dialog>
  `,
})
export class DocsSearch {
  protected readonly open = signal(false);
  protected readonly groups = GROUPS;
  private readonly entries = inject(DOCS_REGISTRY);
  private readonly router = inject(Router);

  constructor() {
    const doc = inject(DOCUMENT);
    const onKeydown = (event: KeyboardEvent): void => {
      if (event.key.toLowerCase() !== 'k' || !(event.ctrlKey || event.metaKey)) return;
      event.preventDefault();
      this.open.update((isOpen) => !isOpen);
    };
    doc.addEventListener('keydown', onKeydown);
    inject(DestroyRef).onDestroy(() => doc.removeEventListener('keydown', onKeydown));
  }

  protected entriesFor(group: string) {
    return this.entries.filter((e) => e.group === group);
  }

  protected go(slug: string): void {
    this.open.set(false);
    void this.router.navigateByUrl(`/components/${slug}`);
  }
}
