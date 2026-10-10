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

export function verifyBuild(browserDir, routes) {
  const problems = [];
  for (const route of routes) {
    const rel = join(route, 'index.html');
    if (!existsSync(join(browserDir, rel))) problems.push(`missing prerendered page: ${rel}`);
  }
  if (!existsSync(join(browserDir, 'index.csr.html')))
    problems.push('missing index.csr.html (404 fallback)');
  return problems;
}

function main() {
  const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const registry = readFileSync(resolve(docsRoot, 'src/content/registry.ts'), 'utf8');
  const slugs = [...registry.matchAll(/slug: '([a-z0-9-]+)'/g)].map((m) => m[1]);
  const browserDir = process.argv[2]
    ? resolve(process.argv[2])
    : resolve(docsRoot, '../../dist/docs/browser');
  const problems = verifyBuild(browserDir, expectedRoutes(slugs, GROUPS));
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log(`verify-build: ${slugs.length} component pages + ${GROUPS.length} groups OK`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
