import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-button-link-demo',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<a muiButton variant="secondary" href="https://github.com/mushilu-san/Mushilu-San-UI"
    >View on GitHub</a
  >`,
})
export class ButtonLinkDemo {}
