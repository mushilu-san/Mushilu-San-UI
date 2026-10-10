import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { expectedRoutes, verifyBuild } from './verify-build.mjs';

function site(paths) {
  const dir = mkdtempSync(join(tmpdir(), 'site-'));
  for (const p of paths) {
    mkdirSync(join(dir, p), { recursive: true });
    writeFileSync(join(dir, p, 'index.html'), '<h1>x</h1>');
  }
  writeFileSync(join(dir, 'index.csr.html'), '');
  return dir;
}

describe('expectedRoutes', () => {
  it('includes static pages, groups and slugs', () => {
    expect(expectedRoutes(['button'], ['forms'])).toEqual([
      '',
      'getting-started',
      'components',
      'components/group/forms',
      'components/button',
    ]);
  });
});

describe('verifyBuild', () => {
  it('passes when every route has an index.html and index.csr.html exists', () => {
    const routes = expectedRoutes(['button'], ['forms']);
    expect(verifyBuild(site(routes), routes)).toEqual([]);
  });

  it('reports missing routes', () => {
    const routes = expectedRoutes(['button'], ['forms']);
    expect(verifyBuild(site(['', 'components']), routes)).toContain(
      'missing prerendered page: components/button/index.html',
    );
  });
});
