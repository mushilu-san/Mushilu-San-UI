import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  signal,
} from '@angular/core';
import type { AvatarShape, AvatarSize } from './avatar.types';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

@Component({
  selector: 'mui-avatar',
  standalone: true,
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'label() || name() || null',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
    '[attr.part]': '"root"',
  },
})
export class Avatar {
  /**
   * Image URL. Bound via `[src]`, so Angular's built-in URL sanitizer applies
   * (e.g. `javascript:` URLs are neutralized). Consumers remain responsible
   * for passing trusted/validated URLs, especially user-generated ones.
   */
  src = input<string>();
  name = input<string>('');
  label = input<string>('');
  size = input<AvatarSize>('md');
  shape = input<AvatarShape>('circle');

  protected readonly imgError = signal(false);
  protected readonly initials = computed(() => initials(this.name() || '?'));
  protected readonly showImage = computed(() => !!this.src() && !this.imgError());
  protected readonly showText = computed(() => !this.showImage());

  protected onImgError(): void {
    this.imgError.set(true);
  }
}
