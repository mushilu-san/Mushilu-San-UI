import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  ViewEncapsulation,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { RESIZABLE_GROUP_CONTEXT } from './resizable-context';

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
export class ResizablePanel implements OnInit {
  defaultSize = input(50, { transform: numberAttribute });
  minSize = input(10, { transform: numberAttribute });
  maxSize = input(90, { transform: numberAttribute });

  private readonly ctx = inject(RESIZABLE_GROUP_CONTEXT);

  protected size: Signal<number> = signal(this.defaultSize());

  ngOnInit(): void {
    const reg = this.ctx.registerPanel(this.defaultSize(), this.minSize(), this.maxSize());
    this.size = reg.size;
  }
}
