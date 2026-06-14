#!/usr/bin/env node
// node-guard — advisory: nudges to activate Node 22 before npm/npx/ng calls.
// Matches: Bash. Decision: "ask" (skippable). Debounced so it nudges ~once per session.
import { existsSync, writeFileSync, statSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { readPayload, allow, decide, bashCommand } from './_util.mjs';

const cmd = bashCommand(readPayload());
if (!cmd) allow();

// Only npm / npx / ng invocations are relevant.
if (!/(^|[\s;&|])(npm|npx|ng)\b/.test(cmd)) allow();

// If the command already activates nvm (or uses ./dev.sh which does), it's fine.
if (/nvm\s+use|nvm\.sh|\.?\/?dev\.sh/.test(cmd)) allow();

// Debounce: nudge at most once per ~8h so it doesn't nag every command.
const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const ack = join(projectDir, '.mui-team', '.node-guard-ack');
const EIGHT_H = 8 * 60 * 60 * 1000;
try {
  if (existsSync(ack) && Date.now() - statSync(ack).mtimeMs < EIGHT_H) allow();
  mkdirSync(dirname(ack), { recursive: true });
  writeFileSync(ack, new Date().toISOString());
} catch {
  /* fail-open: if we can't track state, still nudge */
}

decide(
  'ask',
  'node-guard: this npm/ng call has no Node activation. The repo requires the Node in .nvmrc ' +
    '(22.x) — wrong Node corrupts package-lock.json (EBADENGINE). Prefix with ' +
    '`export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22 &&` or run via ./dev.sh. ' +
    'Confirm to proceed; this nudge is skippable for the rest of the session.',
);
