// Shared helpers for Studio PreToolUse hooks.
// Each hook reads the Claude Code hook JSON from stdin and prints a decision.

import { readFileSync } from 'node:fs';

/** Read and parse the hook payload from stdin. Returns {} on any problem (fail-open). */
export function readPayload() {
  try {
    return JSON.parse(readFileSync(0, 'utf8') || '{}');
  } catch {
    return {};
  }
}

/** Allow the tool call (silent). */
export function allow() {
  process.exit(0);
}

/** Emit a PreToolUse permission decision and exit. decision = "deny" | "ask". */
export function decide(decision, reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: decision,
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}

/** The bash command string for Bash tool calls, or '' otherwise. */
export function bashCommand(payload) {
  return payload?.tool_name === 'Bash' ? String(payload?.tool_input?.command ?? '') : '';
}

/** The target file path for Edit/Write/NotebookEdit calls, or '' otherwise. */
export function editPath(payload) {
  const t = payload?.tool_name;
  if (t === 'Edit' || t === 'Write' || t === 'NotebookEdit') {
    return String(payload?.tool_input?.file_path ?? payload?.tool_input?.notebook_path ?? '');
  }
  return '';
}
