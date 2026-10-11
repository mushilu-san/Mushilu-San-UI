import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Alert } from '@mushilu-san/ui/feedback';

@Component({
  selector: 'docs-alert-variants-demo',
  imports: [Alert],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-alert variant="info" heading="Heads up">Your trial ends in 5 days.</mui-alert>
    <mui-alert variant="success" heading="Saved">Your changes are live.</mui-alert>
    <mui-alert variant="warning" heading="Check your address"
      >The postcode does not match the city.</mui-alert
    >
    <mui-alert variant="danger" heading="Payment failed" [dismissible]="true"
      >Update your card to keep your plan.</mui-alert
    >`,
})
export class AlertVariantsDemo {}
