import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Typography } from '@mushilu-san/ui/data-display';

@Component({
  selector: 'docs-typography-scale-demo',
  imports: [Typography],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2><mui-typography variant="h2">Section heading</mui-typography></h2>
    <mui-typography variant="lead">A lead paragraph introduces the topic.</mui-typography>
    <mui-typography variant="p"
      >Body text that carries most of the content on a page.</mui-typography
    >
    <mui-typography variant="small">Small text for captions and metadata.</mui-typography>
    <mui-typography variant="blockquote"
      >A quotation stands apart from the body text.</mui-typography
    >`,
})
export class TypographyScaleDemo {}
