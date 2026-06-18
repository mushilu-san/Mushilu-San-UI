#!/usr/bin/env node
// Unit test for the within() path-containment helper used by freeze.mjs
// Run: node scripts/team-hooks/within.test.mjs

const within = (child, parent) => child === parent || child.startsWith(parent + '/');

const tests = [
  // [child, parent, expected, label]
  ['/a/b', '/a/b', true, 'exact match'],
  ['/a/b/c', '/a/b', true, 'child inside parent'],
  ['/a/b/c/d', '/a/b', true, 'deeply nested child'],
  ['/a/bc', '/a/b', false, 'sibling-prefix attack (no trailing /)'],
  ['/a/b-extra', '/a/b', false, 'sibling with dash suffix'],
  ['/a', '/a/b', false, 'parent is not within child'],
  ['/x/y', '/a/b', false, 'unrelated paths'],
  ['/a/b/', '/a/b', true, 'trailing slash child'],
  ['/', '/', true, 'root exact match'],
  ['/a', '/', false, 'root edge case: startsWith("//") is false — safe for non-root dirs'],
];

let passed = 0;
let failed = 0;

for (const [child, parent, expected, label] of tests) {
  const result = within(child, parent);
  if (result === expected) {
    passed++;
  } else {
    failed++;
    console.error(`FAIL: ${label} — within("${child}", "${parent}") = ${result}, expected ${expected}`);
  }
}

console.log(`within() tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
