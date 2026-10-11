import type { Type } from '@angular/core';

export type Group =
  | 'primitives'
  | 'forms'
  | 'layout'
  | 'navigation'
  | 'feedback'
  | 'data-display'
  | 'mobile'
  | 'overlays';

export interface DemoRef {
  /** Matches the demo file name: `<id>.demo.ts`. */
  id: string;
  title: string;
  description?: string;
  component: () => Promise<Type<unknown>>;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  group: Group;
  selector: string;
  /** Keys into the generated API index. */
  apiClasses: string[];
  summary: string;
  description: string[];
  whenToUse: string[];
  whenNotToUse: { text: string; alternative?: string }[];
  /** The first entry is the hero demo. */
  demos: DemoRef[];
  guidelines?: { do: string[]; dont: string[] };
  a11y: {
    roles: { element: string; role: string; notes?: string }[];
    keyboard: { keys: string; action: string }[];
    notes: string[];
  };
  tokens?: string[];
  related?: string[];
}

export interface RegistryEntry {
  slug: string;
  name: string;
  group: Group;
  summary: string;
  load: () => Promise<ComponentDoc>;
}
