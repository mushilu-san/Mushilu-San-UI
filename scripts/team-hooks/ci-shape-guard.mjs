#!/usr/bin/env node
// ci-shape-guard — blocks edits that weaken CI's dependency discipline:
//   * replacing `npm ci` with `npm install` in a workflow
//   * hardcoding a Node version instead of node-version-file: .nvmrc
//   * removing the package.json "engines" field
// Matches: Edit, Write. Decision: "deny" (hard).
import { readPayload, allow, decide, editPath } from './_util.mjs';

const payload = readPayload();
const path = editPath(payload);
if (!path) allow();

const input = payload.tool_input ?? {};
// New content being written: Write.content, or Edit.new_string.
const incoming = String(input.content ?? input.new_string ?? '');
const removed = String(input.old_string ?? ''); // present only for Edit

const isWorkflow = /\.github\/workflows\/.+\.ya?ml$/.test(path);
const isPackageJson = /(^|\/)package\.json$/.test(path);

if (isWorkflow) {
  if (/\bnpm\s+install\b/.test(incoming)) {
    decide(
      'deny',
      'ci-shape-guard: a workflow must use `npm ci`, never `npm install` (CLAUDE.md rule 4). ' +
        '`npm install` mutates the lockfile in CI and hides drift. Keep `npm ci`.',
    );
  }
  if (/node-version:\s*['"]?\d/.test(incoming)) {
    decide(
      'deny',
      'ci-shape-guard: Node version is hardcoded. Use `node-version-file: .nvmrc` so CI and ' +
        'local always match (CLAUDE.md rule 2). Do not pin a literal Node version in workflows.',
    );
  }
}

if (isPackageJson && /"engines"/.test(removed) && !/"engines"/.test(incoming)) {
  decide(
    'deny',
    'ci-shape-guard: this edit removes the "engines" field from package.json. engine-strict ' +
      'enforcement is what catches wrong-Node installs (CLAUDE.md rule 3). Keep "engines".',
  );
}

allow();
