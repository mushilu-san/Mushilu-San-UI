import { describe, it, expect } from 'vitest';
import { parseChangesetBody, buildChangelogSection } from './calver-changelog.mjs';

describe('parseChangesetBody', () => {
  it('strips YAML frontmatter and trims the body', () => {
    const content = '---\n"@mushilu-san/ui": patch\n---\n\nFixes a bug.\n';
    expect(parseChangesetBody(content)).toBe('Fixes a bug.');
  });
});

describe('buildChangelogSection', () => {
  it('builds a placeholder section when there are no changesets', () => {
    expect(buildChangelogSection('2026.28.1', '2026-07-08', [])).toBe(
      '## 2026.28.1 — 2026-07-08\n\n_Maintenance release (no changesets)._\n',
    );
  });

  it('lists each changeset body as a bullet', () => {
    const result = buildChangelogSection('2026.28.2', '2026-07-08', [
      'Fixes a bug.',
      'Adds a feature.',
    ]);
    expect(result).toBe('## 2026.28.2 — 2026-07-08\n\n- Fixes a bug.\n\n- Adds a feature.\n');
  });
});
