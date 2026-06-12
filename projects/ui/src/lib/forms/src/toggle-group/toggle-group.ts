import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  Signal,
  ViewEncapsulation,
  booleanAttribute,
  input,
  model,
} from '@angular/core';
import type { ToggleGroupSize, ToggleGroupType, ToggleGroupVariant } from './toggle-group.types';

export interface ToggleGroupContext {
  readonly type:     Signal<ToggleGroupType>;
  readonly size:     Signal<ToggleGroupSize>;
  readonly variant:  Signal<ToggleGroupVariant>;
  readonly disabled: Signal<boolean>;
  isSelected(value: string): boolean;
  select(value: string): void;
}

export const TOGGLE_GROUP_CONTEXT = new InjectionToken<ToggleGroupContext>(
  'TOGGLE_GROUP_CONTEXT',
);

/**
 * ToggleGroup — a set of toggle buttons with single or multiple selection.
 *
 * Usage (single):
 *   <mui-toggle-group [(value)]="alignment">
 *     <mui-toggle-group-item value="left">Left</mui-toggle-group-item>
 *     <mui-toggle-group-item value="center">Center</mui-toggle-group-item>
 *     <mui-toggle-group-item value="right">Right</mui-toggle-group-item>
 *   </mui-toggle-group>
 *
 * Usage (multiple):
 *   <mui-toggle-group type="multiple" [(value)]="formats">
 *     <mui-toggle-group-item value="bold">Bold</mui-toggle-group-item>
 *     <mui-toggle-group-item value="italic">Italic</mui-toggle-group-item>
 *   </mui-toggle-group>
 */
@Component({
  selector: 'mui-toggle-group',
  standalone: true,
  template: `<ng-content />`,
  styleUrl: './toggle-group.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: TOGGLE_GROUP_CONTEXT,
      useFactory: (self: ToggleGroup) => ({
        type:     self.type,
        size:     self.size,
        variant:  self.variant,
        disabled: self.disabled,
        isSelected: (v: string) => self.isSelected(v),
        select:     (v: string) => self.select(v),
      }),
      deps: [ToggleGroup],
    },
  ],
  host: {
    '[attr.role]':         '"group"',
    '[attr.data-type]':    'type()',
    '[attr.data-size]':    'size()',
    '[attr.data-variant]': 'variant()',
    '[attr.part]':         '"root"',
  },
})
export class ToggleGroup {
  type     = input<ToggleGroupType>('single');
  size     = input<ToggleGroupSize>('md');
  variant  = input<ToggleGroupVariant>('default');
  disabled = input(false, { transform: booleanAttribute });

  /** For single mode: the selected value (string). For multiple: comma-joined string of selected values. */
  value = model<string>('');

  isSelected(itemValue: string): boolean {
    if (this.type() === 'multiple') {
      return this.value().split(',').filter(Boolean).includes(itemValue);
    }
    return this.value() === itemValue;
  }

  select(itemValue: string): void {
    if (this.type() === 'multiple') {
      const current = this.value().split(',').filter(Boolean);
      const idx = current.indexOf(itemValue);
      if (idx === -1) {
        this.value.set([...current, itemValue].join(','));
      } else {
        current.splice(idx, 1);
        this.value.set(current.join(','));
      }
    } else {
      // Single: toggle off if already selected, otherwise select
      this.value.set(this.value() === itemValue ? '' : itemValue);
    }
  }
}
