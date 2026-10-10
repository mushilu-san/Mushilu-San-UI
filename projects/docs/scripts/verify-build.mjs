// Verifies the static docs build: every registry route was prerendered and the
// client-render fallback exists.
// Usage: node projects/docs/scripts/verify-build.mjs [browserDir]
//   browserDir defaults to dist/docs/browser (relative to the repo root).
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { GROUPS } from './extract-api.mjs';

export function expectedRoutes(slugs, groups) {
  return [
    '',
    'getting-started',
    'components',
    ...groups.map((g) => `components/group/${g}`),
    ...slugs.map((s) => `components/${s}`),
  ];
}

export function parseSlugs(src) {
  return [...src.matchAll(/slug: (['"])([a-z0-9-]+)\1/g)].map((m) => m[2]);
}

/** Guards (loose count ignores the `slug: string` type annotation)  against vacuous passes: zero slugs, or slug keys the strict parser skipped. */
export function slugProblems(src) {
  const strict = parseSlugs(src).length;
  const loose = (src.match(/\bslug\s*:(?!\s*string\b)/g) ?? []).length;
  if (strict === 0) return ['no component slugs parsed from registry.ts'];
  if (loose !== strict)
    return [
      `registry.ts has ${loose} "slug:" entries but only ${strict} parsed; check slug formatting`,
    ];
  return [];
}

export function verifyBuild(browserDir, routes) {
  const problems = [];
  for (const route of routes) {
    const rel = join(route, 'index.html');
    if (!existsSync(join(browserDir, rel))) problems.push(`missing prerendered page: ${rel}`);
  }
  if (!existsSync(join(browserDir, 'index.csr.html')))
    problems.push('missing index.csr.html (client-render fallback)');
  return problems;
}

function main() {
  const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const registry = readFileSync(resolve(docsRoot, 'src/content/registry.ts'), 'utf8');
  const slugs = parseSlugs(registry);
  const browserDir = process.argv[2]
    ? resolve(process.argv[2])
    : resolve(docsRoot, '../../dist/docs/browser');
  const problems = [
    ...slugProblems(registry),
    ...verifyBuild(browserDir, expectedRoutes(slugs, GROUPS)),
  ];
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log(`verify-build: ${slugs.length} component pages + ${GROUPS.length} groups OK`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
