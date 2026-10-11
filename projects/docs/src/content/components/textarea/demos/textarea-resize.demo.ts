import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Textarea } from '@mushilu-san/ui/forms';

@Component({
  selector: 'docs-textarea-resize-demo',
  imports: [Textarea],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<textarea
      muiTextarea
      size="sm"
      resize="none"
      rows="2"
      aria-label="Small, fixed size"
    ></textarea>
    <textarea
      muiTextarea
      size="lg"
      variant="filled"
      resize="both"
      rows="3"
      aria-label="Large, resizable both ways"
    ></textarea>`,
})
export class TextareaResizeDemo {}
