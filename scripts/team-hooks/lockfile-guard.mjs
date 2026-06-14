#!/usr/bin/env node
// lockfile-guard — blocks committing package.json without package-lock.json in the same commit.
// This is the #1 documented CI breakage (CLAUDE.md §Dependency & lockfile rules).
// Matches: Bash. Decision: "deny" (hard).
import { execFileSync } from 'node:child_process';
import { readPayload, allow, decide, bashCommand } from './_util.mjs';

const cmd = bashCommand(readPayload());
if (!cmd) allow();

// Only inspect git commit invocations.
if (!/\bgit\s+commit\b/.test(cmd)) allow();

let staged = '';
try {
  // execFile (no shell) with a fixed arg array — no interpolation, no injection surface.
  staged = execFileSync('git', ['diff', '--cached', '--name-only'], {
    cwd: process.env.CLAUDE_PROJECT_DIR || process.cwd(),
    encoding: 'utf8',
  });
} catch {
  allow(); // not a git repo / git unavailable — don't block
}

const files = staged.split('\n').map((f) => f.trim()).filter(Boolean);
const pkg = files.some((f) => f === 'package.json' || f.endsWith('/package.json'));
const lock = files.some((f) => f === 'package-lock.json' || f.endsWith('/package-lock.json'));

if (pkg && !lock) {
  decide(
    'deny',
    'lockfile-guard: package.json is staged but package-lock.json is not. Per CLAUDE.md ' +
      '§Dependency & lockfile rules they MUST be committed together (regenerate under Node 22: ' +
      '`nvm use && npm install`, then `git add package.json package-lock.json`). Staging only ' +
      'package.json is exactly what broke CI for days. Re-stage the lockfile and commit again.',
  );
}
allow();
