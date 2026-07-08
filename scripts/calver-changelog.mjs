#!/usr/bin/env node
// Consumes pending .changeset/*.md files into a CalVer changelog entry, bumps
// projects/ui/package.json's version, and deletes the consumed changeset files.
// Usage: node scripts/calver-changelog.mjs <version> [notesOutPath]

import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHANGESET_DIR = '.changeset';
const CHANGELOG_PATH = 'projects/ui/CHANGELOG.md';
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

function listChangesetFiles() {
  return readdirSync(CHANGESET_DIR)
    .filter((name) => name.endsWith('.md') && name !== 'README.md')
    .map((name) => join(CHANGESET_DIR, name));
}

function main() {
  const version = process.argv[2];
  if (!version) {
    throw new Error('Usage: node scripts/calver-changelog.mjs <version> [notesOutPath]');
  }
  const notesOutPath = process.argv[3] ?? '/tmp/calver-release-notes.md';

  const changesetFiles = listChangesetFiles();
  const bodies = changesetFiles.map((path) => parseChangesetBody(readFileSync(path, 'utf8')));

  const isoDate = new Date().toISOString().slice(0, 10);
  const section = buildChangelogSection(version, isoDate, bodies);

  const existingChangelog = readFileSync(CHANGELOG_PATH, 'utf8');
  const titleMatch = existingChangelog.match(/^# .*\n/);
  const title = titleMatch ? titleMatch[0] : '';
  const rest = existingChangelog.slice(title.length).replace(/^\n+/, '');
  writeFileSync(CHANGELOG_PATH, `${title}\n${section}\n${rest}`);

  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  packageJson.version = version;
  writeFileSync(PACKAGE_JSON_PATH, `${JSON.stringify(packageJson, null, 2)}\n`);

  for (const path of changesetFiles) {
    unlinkSync(path);
  }

  writeFileSync(notesOutPath, section);
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
