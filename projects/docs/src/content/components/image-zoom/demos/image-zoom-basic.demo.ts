import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImageZoom } from '@mushilu-san/ui/data-display';

@Component({
  selector: 'docs-image-zoom-basic-demo',
  imports: [ImageZoom],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-image-zoom
    src="data:image/svg+xml;utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27100%27%3E%3Crect width=%27160%27 height=%27100%27 fill=%27%236366f1%27/%3E%3C/svg%3E"
    alt="Certificate of completion"
    caption="Issued 2026"
  />`,
})
export class ImageZoomBasicDemo {}
