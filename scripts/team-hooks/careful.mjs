#!/usr/bin/env node
// careful — asks for confirmation before destructive shell commands.
// Matches: Bash. Decision: "ask" (the user can confirm or cancel).
import { readPayload, allow, decide, bashCommand } from './_util.mjs';

const cmd = bashCommand(readPayload());
if (!cmd) allow();

const DANGER = [
  { re: /\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r|-r\s+-f|-f\s+-r)\b/i, why: 'recursive force delete (rm -rf)' },
  { re: /\bgit\s+push\b[^\n]*\s(--force|-f)\b/i, why: 'force push (rewrites remote history)' },
  { re: /\bgit\s+reset\s+--hard\b/i, why: 'hard reset (discards uncommitted work)' },
  { re: /\bgit\s+clean\s+-[a-z]*f/i, why: 'git clean -f (deletes untracked files)' },
  { re: /\bDROP\s+(TABLE|DATABASE|SCHEMA)\b/i, why: 'destructive SQL (DROP)' },
  { re: /\bnpm\b[^\n]*\s(--force|-f)\b/i, why: 'npm --force (can corrupt the dependency tree)' },
];

const hit = DANGER.find((d) => d.re.test(cmd));
if (!hit) allow();

decide(
  'ask',
  `careful: this command looks destructive — ${hit.why}. Confirm you really intend to run it. ` +
    `If you're mid-debug, prefer /mui-investigate and a narrower command.`,
);
