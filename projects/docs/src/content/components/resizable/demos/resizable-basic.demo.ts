import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@mushilu-san/ui/layout';

@Component({
  selector: 'docs-resizable-basic-demo',
  imports: [ResizablePanelGroup, ResizablePanel, ResizableHandle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-resizable-panel-group direction="horizontal" style="min-height: 180px;">
    <mui-resizable-panel [defaultSize]="30" [minSize]="15">
      <div style="padding: var(--mui-space-3);">Files</div>
    </mui-resizable-panel>
    <mui-resizable-handle [withHandle]="true" />
    <mui-resizable-panel [defaultSize]="70" [minSize]="30">
      <div style="padding: var(--mui-space-3);">Editor</div>
    </mui-resizable-panel>
  </mui-resizable-panel-group>`,
})
export class ResizableBasicDemo {}
