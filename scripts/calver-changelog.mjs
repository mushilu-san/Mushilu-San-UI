#!/usr/bin/env node
// Builds CalVer release notes from changesets added since the previous release
// tag, and bumps projects/ui/package.json's version (in the working tree only —
// this is never committed; see the design spec's 2026-07-12 amendment for why).
// Usage: node scripts/calver-changelog.mjs <version> [previousTag] [notesOutPath]

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHANGESET_DIR = '.changeset';
const PACKAGE_JSON_PATH = 'projects/ui/package.json';

export function parseChangesetBody(fileContent) {
  const match = fileContent.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  const body = match ? match[1] : fileContent;
  return body.trim();
}

export function buildChangelogSection(version, isoDate, bodies) {
  const heading = `## ${version} — ${isoDate}`;
  if (bodies.length === 0) {
    return `${heading}\n\n_Maintenance release (no changesets)._\n`;
  }
  const entries = bodies.map((body) => `- ${body}`).join('\n\n');
  return `${heading}\n\n${entries}\n`;
}

function listNewChangesetFiles(previousTag) {
  if (!previousTag) {
    return readdirSync(CHANGESET_DIR)
      .filter((name) => name.endsWith('.md') && name !== 'README.md')
      .map((name) => join(CHANGESET_DIR, name))
      .sort();
  }
  const output = execFileSync(
    'git',
    ['diff', '--name-only', '--diff-filter=A', `${previousTag}..HEAD`, '--', CHANGESET_DIR],
    { encoding: 'utf8' },
  );
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.endsWith('.md') && !line.endsWith('README.md'))
    .sort();
}

function main() {
  const version = process.argv[2];
  if (!version) {
    throw new Error('Usage: node scripts/calver-changelog.mjs <version> [previousTag] [notesOutPath]');
  }
  const previousTag = process.argv[3] || null;
  const notesOutPath = process.argv[4] ?? '/tmp/calver-release-notes.md';

  const changesetFiles = listNewChangesetFiles(previousTag);
  const bodies = changesetFiles.map((path) => parseChangesetBody(readFileSync(path, 'utf8')));

  const isoDate = new Date().toISOString().slice(0, 10);
  const section = buildChangelogSection(version, isoDate, bodies);

  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  packageJson.version = version;
  writeFileSync(PACKAGE_JSON_PATH, `${JSON.stringify(packageJson, null, 2)}\n`);

  writeFileSync(notesOutPath, section);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
