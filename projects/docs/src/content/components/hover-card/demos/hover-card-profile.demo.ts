import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@mushilu-san/ui/overlays';
import { Avatar } from '@mushilu-san/ui/primitives';

@Component({
  selector: 'docs-hover-card-profile-demo',
  imports: [HoverCard, HoverCardTrigger, HoverCardContent, Avatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>
    Written by
    <mui-hover-card [openDelay]="400" [closeDelay]="200">
      <a href="#dana" muiHoverCardTrigger>Dana Levi</a>
      <mui-hover-card-content>
        <mui-avatar name="Dana Levi" />
        <p><strong>Dana Levi</strong><br />Design lead, 12 articles</p>
      </mui-hover-card-content>
    </mui-hover-card>
  </p>`,
})
export class HoverCardProfileDemo {}
