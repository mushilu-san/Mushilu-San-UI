#!/usr/bin/env node
// freeze — when a freeze marker is active, blocks edits outside the frozen directory.
// The marker `.mui-team/freeze` contains one directory path (relative to the project root).
// Always allows edits to `.mui-team/` itself so the freeze can be lifted.
// Matches: Edit, Write, NotebookEdit. Decision: "deny" (hard).
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { readPayload, allow, decide, editPath } from './_util.mjs';

const payload = readPayload();
const target = editPath(payload);
if (!target) allow();

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const marker = join(projectDir, '.mui-team', 'freeze');
if (!existsSync(marker)) allow(); // no freeze active

let dir = '';
try {
  dir = readFileSync(marker, 'utf8').trim();
} catch {
  allow();
}
if (!dir) allow();

const frozenAbs = resolve(projectDir, dir);
const teamAbs = resolve(projectDir, '.mui-team');
const targetAbs = resolve(target);

const within = (child, parent) => child === parent || child.startsWith(parent + '/');

// Always allow edits inside the frozen dir, or inside .mui-team (so /mui-unfreeze works).
if (within(targetAbs, frozenAbs) || within(targetAbs, teamAbs)) allow();

decide(
  'deny',
  `freeze: edits are locked to "${dir}" but this targets "${target}". This guard stops a debug ` +
    `session from spreading orthogonal changes. Edit within "${dir}", or clear the freeze with ` +
    `/mui-unfreeze (delete .mui-team/freeze) if you genuinely need to work elsewhere.`,
);
