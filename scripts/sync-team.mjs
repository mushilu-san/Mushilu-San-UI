#!/usr/bin/env node
// Usage:
//   node scripts/sync-team.mjs            # generate .claude/skills/* and .cursor/rules/*
//   node scripts/sync-team.mjs --check    # exit 1 if any generated file is out of sync
//
// Single source of truth: team/agents/*.agent.md
// Each source has simple `key: value` frontmatter (no nested YAML) + a markdown body.
// The body is emitted VERBATIM into BOTH the Claude SKILL.md and the Cursor .mdc, so the
// two can never drift. Frontmatter drives the per-target metadata only.

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const AGENTS_DIR = join(ROOT, 'team', 'agents');
const SKILLS_DIR = join(ROOT, '.claude', 'skills');
const RULES_DIR = join(ROOT, '.cursor', 'rules');

const GENERATED_BANNER =
  '<!-- GENERATED — do not edit here. Edit the source under team/agents and re-run the Studio sync script. -->';

/** Parse `key: value` frontmatter (scalars only) + body. */
function parseSource(raw, file) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing or malformed frontmatter`);
  const fm = {};
  for (const line of m[1].split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const i = line.indexOf(':');
    if (i === -1) throw new Error(`${file}: bad frontmatter line: ${line}`);
    fm[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const key of ['name', 'codename', 'slash', 'role', 'use_when']) {
    if (!fm[key]) throw new Error(`${file}: frontmatter missing required key "${key}"`);
  }
  if (!/^[a-z0-9-]+$/.test(fm.name)) throw new Error(`${file}: name must be kebab-case`);
  return { fm, body: m[2].trim() };
}

/** Claude Code SKILL.md: name + description trigger the skill. */
function renderSkill({ fm, body }) {
  const description = `${fm.role} Use when: ${fm.use_when}`;
  return `---
name: ${fm.name}
description: ${description}
---

${GENERATED_BANNER}

# ${fm.codename} — \`/${fm.slash}\`

${body}
`;
}

/** Cursor rule: glob-scoped when `globs` set, else agent-requested (alwaysApply: false). */
function renderRule({ fm, body }) {
  const lines = ['---', `description: ${fm.role}`];
  if (fm.globs) lines.push(`globs: ${fm.globs}`);
  lines.push('alwaysApply: false', '---', '', GENERATED_BANNER, '', `# ${fm.codename} — \`/${fm.slash}\``, '', body, '');
  return lines.join('\n');
}

/** Tiny always-on index so Cursor knows the team exists. */
function renderIndex(parsed) {
  const rows = parsed
    .map((p) => `- **${p.fm.codename}** \`/${p.fm.slash}\` — ${p.fm.role}`)
    .join('\n');
  return `---
description: The Studio — index of project-local agents for Mushilu-San-UI. Invoke an agent by its slash command or ask for it by role.
alwaysApply: true
---

${GENERATED_BANNER}

# The Studio (agent roster)

Pipeline: Frame → Spec → Build → (Style ‖ A11y ‖ Review) → Test → Size → Ship → Learn.

${rows}

Sources live in \`team/agents/\`; regenerate with \`node scripts/sync-team.mjs\`.
`;
}

function collectOutputs() {
  const files = readdirSync(AGENTS_DIR).filter((f) => f.endsWith('.agent.md')).sort();
  if (!files.length) throw new Error(`no *.agent.md sources in ${AGENTS_DIR}`);
  const parsed = files.map((f) => parseSource(readFileSync(join(AGENTS_DIR, f), 'utf8'), f));
  const out = new Map();
  for (const p of parsed) {
    out.set(join(SKILLS_DIR, p.fm.name, 'SKILL.md'), renderSkill(p));
    // targets: "skill" → Claude-only (e.g. hook controls); default "both" also emits a Cursor rule.
    if ((p.fm.targets ?? 'both') !== 'skill') out.set(join(RULES_DIR, `${p.fm.name}.mdc`), renderRule(p));
  }
  // The Cursor index lists only agents that actually have a Cursor rule.
  out.set(join(RULES_DIR, '00-studio-index.mdc'), renderIndex(parsed.filter((p) => (p.fm.targets ?? 'both') !== 'skill')));
  return out;
}

const check = process.argv.includes('--check');
const outputs = collectOutputs();
let drift = 0;

for (const [path, content] of outputs) {
  const current = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (current === content) continue;
  if (check) {
    console.error(`DRIFT: ${path.replace(ROOT + '/', '')}`);
    drift++;
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
    console.log(`wrote ${path.replace(ROOT + '/', '')}`);
  }
}

if (check) {
  if (drift) {
    console.error(`\n${drift} file(s) out of sync. Run: node scripts/sync-team.mjs`);
    process.exit(1);
  }
  console.log('✅ Studio skills/rules in sync with team/agents/.');
} else {
  console.log(`\n✅ Generated/verified ${outputs.size} file(s) (${(outputs.size - 1) / 2} agents + index).`);
}
