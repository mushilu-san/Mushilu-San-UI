#!/usr/bin/env node
// Computes the next CalVer release version (YYYY.WW.N) from existing git tags.
// Usage: node scripts/calver-version.mjs
// Writes `version=<value>` to $GITHUB_OUTPUT if set, otherwise prints to stdout.

import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

export function isoWeekYearAndWeek(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const isoYear = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return { year: isoYear, week };
}

export function computeNextVersion(tags, referenceDate = new Date()) {
  const { year, week } = isoWeekYearAndWeek(referenceDate);
  const weekStr = String(week).padStart(2, '0');
  const prefix = `v${year}.${weekStr}.`;
  const counters = tags
    .filter((tag) => tag.startsWith(prefix))
    .map((tag) => Number(tag.slice(prefix.length)))
    .filter((n) => Number.isInteger(n) && n > 0);
  const next = counters.length > 0 ? Math.max(...counters) + 1 : 1;
  return `${year}.${weekStr}.${next}`;
}

function main() {
  const tags = execFileSync('git', ['tag', '-l'], { encoding: 'utf8' })
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);
  const version = computeNextVersion(tags, new Date());
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
  } else {
    console.log(version);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
