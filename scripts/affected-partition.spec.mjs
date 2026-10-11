import { describe, expect, it } from 'vitest';
import { splitByProject } from './affected-partition.mjs';

describe('splitByProject', () => {
  it('sends docs specs to the docs project, not to ui', () => {
    expect(splitByProject(['projects/docs/src/app/shell/docs-search.spec.ts'])).toEqual({
      ui: [],
      docs: ['projects/docs/src/app/shell/docs-search.spec.ts'],
    });
  });

  it('keeps library specs in the ui project', () => {
    expect(splitByProject(['projects/ui/src/lib/primitives/src/badge/badge.spec.ts'])).toEqual({
      ui: ['projects/ui/src/lib/primitives/src/badge/badge.spec.ts'],
      docs: [],
    });
  });

  it('splits a mixed diff so each project runs only its own specs', () => {
    const globs = [
      'projects/ui/src/**/badge/**/*.spec.ts',
      'projects/docs/src/app/shared/demo-viewer/demo-viewer.spec.ts',
    ];
    expect(splitByProject(globs)).toEqual({
      ui: ['projects/ui/src/**/badge/**/*.spec.ts'],
      docs: ['projects/docs/src/app/shared/demo-viewer/demo-viewer.spec.ts'],
    });
  });
});
