#!/usr/bin/env node
// Resolves scripts/affected.mjs output into an actual test run: exact affected
// specs/e2e files, the full suite ("ALL"), or a no-op skip (nothing affected).
//
// Usage:
//   node scripts/affected-run.mjs unit [--base <ref>]
//   node scripts/affected-run.mjs e2e  [--base <ref>]

import { execFileSync, spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const mode = process.argv[2];
if (mode !== 'unit' && mode !== 'e2e') {
  console.error('Usage: affected-run.mjs <unit|e2e> [--base <ref>]');
  process.exit(1);
}

const baseIdx = process.argv.indexOf('--base');
const base = baseIdx !== -1 ? process.argv[baseIdx + 1] : 'origin/main';

const affectedScript = resolve(__dirname, 'affected.mjs');
const output = execFileSync(
  process.execPath,
  [affectedScript, '--base', base, '--mode', mode],
  { encoding: 'utf8' },
).trim();

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  process.exit(result.status ?? 1);
}

if (output === '') {
  console.log(`[affected] no ${mode} tests affected by this diff — skipping.`);
  process.exit(0);
}

if (output === 'ALL') {
  console.log(`[affected] cross-cutting change detected — running full ${mode} suite.`);
  run('npm', ['run', mode === 'unit' ? 'test:ci' : 'e2e']);
}

const items = output.split('\n').filter(Boolean);
console.log(`[affected] running ${items.length} affected ${mode} target(s):\n  ${items.join('\n  ')}`);

if (mode === 'unit') {
  run('npx', ['nx', 'test', 'ui', '--no-watch', ...items.map((glob) => `--include=${glob}`)]);
} else {
  run('npx', ['playwright', 'test', ...items]);
}
