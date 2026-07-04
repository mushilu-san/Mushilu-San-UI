#!/usr/bin/env node
// Maps a git diff to affected unit spec globs or e2e test files, using this
// repo's naming convention: src/lib/<group>/src/<name>/<name>.ts <-> co-located
// <name>.spec.ts <-> e2e/<name>.e2e.ts <-> testing/<name>-harness.ts.
//
// Usage:
//   node scripts/affected.mjs --base origin/main --mode unit   # prints spec globs, "ALL", or nothing
//   node scripts/affected.mjs --base origin/main --mode e2e    # prints e2e files, "ALL", or nothing
//
// "ALL" means: run the full suite (a cross-cutting file changed, or a changed
// component has no exact e2e match — ambiguous, so stay safe). Nothing printed
// means: no tests are affected by this diff (e.g. docs-only change).

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

function parseArgs(argv) {
  const args = { base: 'origin/main', mode: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--base') args.base = argv[++i];
    else if (argv[i] === '--mode') args.mode = argv[++i];
  }
  if (args.mode !== 'unit' && args.mode !== 'e2e') {
    console.error('Usage: affected.mjs --base <ref> --mode <unit|e2e>');
    process.exit(1);
  }
  return args;
}

function git(gitArgs, cwd) {
  return execFileSync('git', gitArgs, { cwd, encoding: 'utf8' }).trim();
}

function getChangedFiles(repoRoot, base) {
  let mergeBase;
  try {
    mergeBase = git(['merge-base', base, 'HEAD'], repoRoot);
  } catch {
    mergeBase = base; // base ref has no common ancestor locally — diff against it directly
  }
  const committed = git(['diff', '--name-only', `${mergeBase}...HEAD`], repoRoot);
  const uncommitted = git(['diff', '--name-only', 'HEAD'], repoRoot);
  const untracked = git(['ls-files', '--others', '--exclude-standard'], repoRoot);
  const all = new Set();
  for (const block of [committed, uncommitted, untracked]) {
    for (const line of block.split('\n')) {
      if (line.trim()) all.add(line.trim());
    }
  }
  return [...all];
}

// Cross-cutting paths: any change here invalidates the convention mapping,
// so fall back to a full run rather than risk a false negative.
const SAFELIST_PREFIXES = [
  'projects/ui/src/styles/',
  'projects/ui/src/core/',
  'projects/ui/e2e/helpers/',
  '.storybook/',
  '.github/workflows/',
];
const SAFELIST_FILES = new Set([
  'angular.json',
  'nx.json',
  'project.json',
  'package.json',
  'package-lock.json',
  'playwright.config.ts',
  'projects/ui/src/test-setup.ts',
  'scripts/affected.mjs',
  'scripts/affected-run.mjs',
]);

function isSafelisted(file) {
  if (SAFELIST_FILES.has(file)) return true;
  if (SAFELIST_PREFIXES.some((prefix) => file.startsWith(prefix))) return true;
  if (/(^|\/)tsconfig[^/]*\.json$/.test(file)) return true;
  return false;
}

const COMPONENT_DIR_RE = /^projects\/ui\/src\/lib\/[^/]+\/src\/([^/]+)\//;
const HARNESS_RE = /^projects\/ui\/src\/lib\/[^/]+\/src\/testing\/([^/]+)-harness\.ts$/;

function affectedNames(files) {
  const names = new Set();
  for (const file of files) {
    const harnessMatch = HARNESS_RE.exec(file);
    if (harnessMatch) {
      names.add(harnessMatch[1]);
      continue;
    }
    const dirMatch = COMPONENT_DIR_RE.exec(file);
    if (dirMatch && dirMatch[1] !== 'testing') {
      names.add(dirMatch[1]);
    }
  }
  return names;
}

function affectedUnitGlobs(files) {
  const globs = new Set();
  for (const name of affectedNames(files)) {
    globs.add(`projects/ui/src/**/${name}/**/*.spec.ts`);
  }
  for (const file of files) {
    if (file.endsWith('.spec.ts')) globs.add(file);
  }
  return [...globs];
}

function affectedE2eFiles(files, repoRoot) {
  const e2eFiles = new Set();
  let fullRequired = false;
  for (const name of affectedNames(files)) {
    const rel = `projects/ui/e2e/${name}.e2e.ts`;
    if (existsSync(resolve(repoRoot, rel))) {
      e2eFiles.add(rel);
    } else {
      fullRequired = true; // no exact e2e match — component is a sub-part or unmapped
    }
  }
  for (const file of files) {
    if (file.startsWith('projects/ui/e2e/') && file.endsWith('.e2e.ts')) {
      e2eFiles.add(file);
    }
  }
  return fullRequired ? 'ALL' : [...e2eFiles];
}

const args = parseArgs(process.argv.slice(2));
const repoRoot = git(['rev-parse', '--show-toplevel'], process.cwd());
const changed = getChangedFiles(repoRoot, args.base);

if (changed.length === 0) {
  process.exit(0);
}

if (changed.some(isSafelisted)) {
  console.log('ALL');
  process.exit(0);
}

const result = args.mode === 'unit' ? affectedUnitGlobs(changed) : affectedE2eFiles(changed, repoRoot);

if (result === 'ALL') {
  console.log('ALL');
} else if (result.length > 0) {
  console.log(result.join('\n'));
}
