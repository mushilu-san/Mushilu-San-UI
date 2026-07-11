#!/usr/bin/env node
// Computes the next CalVer release version (YYYY.WW.N) from existing git tags.
// Usage: node scripts/calver-version.mjs
// Writes `version=<value>` to $GITHUB_OUTPUT if set, otherwise prints to stdout.

import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

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

export function findLatestTag(tags) {
  let best = null;
  for (const tag of tags) {
    const match = tag.match(/^v(\d+)\.(\d+)\.(\d+)$/);
    if (!match) continue;
    const candidate = { tag, year: Number(match[1]), week: Number(match[2]), counter: Number(match[3]) };
    if (
      !best ||
      candidate.year > best.year ||
      (candidate.year === best.year && candidate.week > best.week) ||
      (candidate.year === best.year && candidate.week === best.week && candidate.counter > best.counter)
    ) {
      best = candidate;
    }
  }
  return best ? best.tag : null;
}

function main() {
  const tags = execFileSync('git', ['tag', '-l'], { encoding: 'utf8' })
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);
  const version = computeNextVersion(tags, new Date());
  const previousTag = findLatestTag(tags) ?? '';
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
    appendFileSync(process.env.GITHUB_OUTPUT, `previous_tag=${previousTag}\n`);
  } else {
    console.log(version);
    console.log(previousTag);
  }
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
