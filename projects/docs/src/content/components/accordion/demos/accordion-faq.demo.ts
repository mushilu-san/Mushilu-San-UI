import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccordionGroup, AccordionItem } from '@mushilu-san/ui/data-display';

@Component({
  selector: 'docs-accordion-faq-demo',
  imports: [AccordionGroup, AccordionItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-accordion>
    <mui-accordion-item heading="How long does delivery take?">
      <p>Standard delivery takes three to five working days.</p>
    </mui-accordion-item>
    <mui-accordion-item heading="Can I return an item?">
      <p>Yes, within 30 days, if it is unused and in its box.</p>
    </mui-accordion-item>
    <mui-accordion-item heading="Do you ship abroad?" [disabled]="true">
      <p>Not at the moment.</p>
    </mui-accordion-item>
  </mui-accordion>`,
})
export class AccordionFaqDemo {}
