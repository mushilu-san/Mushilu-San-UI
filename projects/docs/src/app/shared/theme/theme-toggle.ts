import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Button } from '@mushilu-san/ui/primitives';
import { type ThemePreference, ThemeService } from './theme.service';

const NEXT: Record<ThemePreference, ThemePreference> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

@Component({
  selector: 'docs-theme-toggle',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    button {
      min-width: var(--mui-touch-target);
      min-height: var(--mui-touch-target);
    }
  `,
  template: `
    <button
      muiButton
      variant="ghost"
      type="button"
      [attr.aria-label]="label()"
      (click)="theme.cycle()"
    >
      @switch (theme.preference()) {
        @case ('light') {
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="4" />
            <path
              d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            />
          </svg>
        }
        @case ('dark') {
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        }
        @default {
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="2" y="4" width="20" height="13" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        }
      }
    </button>
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  protected readonly label = computed(() => {
    const current = this.theme.preference();
    return `Theme: ${current}. Switch to ${NEXT[current]}`;
  });
}
