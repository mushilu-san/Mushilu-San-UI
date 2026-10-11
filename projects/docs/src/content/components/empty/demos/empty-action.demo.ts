import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Empty } from '@mushilu-san/ui/data-display';
import { Button, Icon } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-empty-action-demo',
  imports: [Empty, Button, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-empty
    title="No invoices yet"
    description="Create your first invoice to send it to a client."
  >
    <mui-icon slot="icon" name="calendar" />
    <button muiButton slot="action">Create invoice</button>
  </mui-empty>`,
})
export class EmptyActionDemo {}
