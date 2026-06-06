import { inject, Injectable } from '@angular/core';
import { MUSHILU_UI_CONFIG } from '../tokens/provider';

let counter = 0;

@Injectable({ providedIn: 'root' })
export class IdGenerator {
  private readonly prefix = inject(MUSHILU_UI_CONFIG).idPrefix ?? 'mui';

  next(name: string): string {
    return `${this.prefix}-${name}-${++counter}`;
  }
}
