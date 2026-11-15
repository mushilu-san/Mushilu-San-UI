import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkipLink } from '@mushilu-san/ui/navigation';

@Component({
  selector: 'docs-skip-link-basic-demo',
  imports: [SkipLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Click here, then press Tab to reveal the link.</p>
    <a muiSkipLink href="#skip-demo-main">Skip to main content</a>
    <div id="skip-demo-main">The target receives focus.</div>`,
})
export class SkipLinkBasicDemo {}
