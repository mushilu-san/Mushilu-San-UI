import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { SIDEBAR_CONTEXT } from './sidebar-context';

@Component({
  selector: 'mui-sidebar-section',
  standalone: true,
  templateUrl: './sidebar-section.html',
  styleUrl: './sidebar-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: { '[attr.part]': '"section"' },
})
export class SidebarSection {
  label = input('');

  private readonly ctx = inject(SIDEBAR_CONTEXT);
  protected readonly showLabel = computed(() => this.ctx.expanded() && !!this.label());
}
