import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormField, Textarea } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-textarea-basic-demo',
  imports: [FormField, Textarea],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mui-form-field label="Feedback" controlId="feedback" hint="Up to 500 characters.">
    <textarea muiTextarea id="feedback" rows="4" maxlength="500"></textarea>
  </mui-form-field>`,
})
export class TextareaBasicDemo {}
