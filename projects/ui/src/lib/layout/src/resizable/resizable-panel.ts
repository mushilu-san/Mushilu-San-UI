import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Signal,
  ViewEncapsulation,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { RESIZABLE_GROUP_CONTEXT, ResizablePanelRegistration } from './resizable-context';

@Component({
  selector: 'mui-resizable-panel',
  standalone: true,
  template: '<ng-content />',
  styleUrl: './resizable-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[style.flex-basis.%]': 'size()',
    '[attr.part]': '"panel"',
  },
})
export class ResizablePanel implements OnInit, OnDestroy {
  /** Initial size as a percentage of the group. Default `50`. */
  defaultSize = input(50, { transform: numberAttribute });
  /** Smallest size the user can drag this panel to, as a percentage. Default `10`. */
  minSize = input(10, { transform: numberAttribute });
  /** Largest size the user can drag this panel to, as a percentage. Default `90`. */
  maxSize = input(90, { transform: numberAttribute });

  private readonly ctx = inject(RESIZABLE_GROUP_CONTEXT);
  private _registration: ResizablePanelRegistration | null = null;

  protected size: Signal<number> = signal(this.defaultSize());

  ngOnInit(): void {
    const reg = this.ctx.registerPanel(this.defaultSize(), this.minSize(), this.maxSize());
    this._registration = reg;
    this.size = reg.size;
  }

  ngOnDestroy(): void {
    if (this._registration) {
      this.ctx.unregisterPanel(this._registration);
      this._registration = null;
    }
  }
}
