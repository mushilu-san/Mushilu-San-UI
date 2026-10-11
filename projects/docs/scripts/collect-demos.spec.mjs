import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { collectDemos, renderModule } from './collect-demos.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureDir = resolve(here, '__fixtures__/content');

describe('collectDemos', () => {
  it('indexes every *.demo.ts by file name with raw and tokenized source', () => {
    const index = collectDemos(fixtureDir);
    expect(Object.keys(index).sort()).toEqual(['alpha-basic', 'beta-basic']);
    expect(index['alpha-basic'].source).toBe('export const alpha = 1;\n');
    expect(index['alpha-basic'].lines[0][0]).toEqual({ t: 'kw', v: 'export' });
  });

  it('throws on duplicate demo ids', () => {
    const dir = mkdtempSync(join(tmpdir(), 'demos-'));
    for (const sub of ['a/demos', 'b/demos']) {
      mkdirSync(join(dir, sub), { recursive: true });
      writeFileSync(join(dir, sub, 'same.demo.ts'), 'export {};\n');
    }
    expect(() => collectDemos(dir)).toThrow(/Duplicate demo id "same"/);
  });

  it('renders a typed TS module', () => {
    const mod = renderModule(collectDemos(fixtureDir));
    expect(mod).toContain("import type { DemoSourceIndex } from '../content/code-types';");
    expect(mod).toContain('export const DEMO_SOURCES: DemoSourceIndex = {');
  });
});
