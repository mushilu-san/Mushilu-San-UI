import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { expectedRoutes, parseSlugs, slugProblems, verifyBuild } from './verify-build.mjs';

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

describe('verifyBuild fallbacks', () => {
  it('reports missing group page', () => {
    const routes = expectedRoutes(['button'], ['forms']);
    const dir = site(routes.filter((r) => r !== 'components/group/forms'));
    expect(verifyBuild(dir, routes)).toContain(
      'missing prerendered page: components/group/forms/index.html',
    );
  });

  it('reports missing index.csr.html', () => {
    const dir = site([]);
    rmSync(join(dir, 'index.csr.html'));
    expect(verifyBuild(dir, [])).toEqual(['missing index.csr.html (client-render fallback)']);
  });
});

describe('parseSlugs', () => {
  it('accepts single and double quotes', () => {
    expect(parseSlugs(`{ slug: 'a-b' }, { slug: "c1" }`)).toEqual(['a-b', 'c1']);
  });
});

describe('slugProblems', () => {
  it('passes when strict and loose counts agree', () => {
    expect(slugProblems(`slug: 'a', slug: "b"`)).toEqual([]);
  });
  it('ignores the slug: string type annotation', () => {
    expect(slugProblems(`slug: 'a'; find(slug: string)`)).toEqual([]);
  });
  it('fails on zero slugs', () => {
    expect(slugProblems('export const x = [];')).toEqual([
      'no component slugs parsed from registry.ts',
    ]);
  });
  it('fails when a slug key is not parseable', () => {
    expect(slugProblems(`slug: 'a', slug: SLUG_B`)).toEqual([
      'registry.ts has 2 "slug:" entries but only 1 parsed; check slug formatting',
    ]);
  });
});
