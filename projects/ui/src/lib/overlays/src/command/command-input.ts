import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
  inject,
  input,
} from '@angular/core';
import { COMMAND_CONTEXT } from './command';

@Component({
  selector: 'mui-command-input',
  standalone: true,
  template: `
    <div class="mui-command-input__wrapper" part="input-wrapper">
      <svg class="mui-command-input__icon" viewBox="0 0 16 16" width="16" height="16" fill="none"
           stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <circle cx="6.5" cy="6.5" r="4"/>
        <path d="M11 11l3 3"/>
      </svg>
      <input
        type="text"
        class="mui-command-input__field"
        part="input"
        [attr.placeholder]="placeholder()"
        [value]="ctx.search()"
        (input)="onInput($event)"
        (keydown.arrowDown)="$event.preventDefault(); ctx.focusNext()"
        (keydown.arrowUp)="$event.preventDefault(); ctx.focusPrev()"
        aria-autocomplete="list"
        autocomplete="off"
        spellcheck="false"
      />
    </div>
  `,
  styleUrl: './command-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: { '[attr.part]': '"input-root"' },
})
export class CommandInput {
  placeholder = input('Search…');
  protected readonly ctx = inject(COMMAND_CONTEXT);

  protected onInput(event: Event): void {
    this.ctx.setSearch((event.target as HTMLInputElement).value);
  }
}
