#!/usr/bin/env bash
# Usage: ./scripts/ci-verify.sh [--skip-install]
# Mirrors .github/workflows/ci.yml exactly: clean install -> lint -> format check -> test -> build -> size budget -> storybook build.
# Run before pushing to catch CI failures locally. Requires the Node version from .nvmrc.

set -euo pipefail
cd "$(dirname "$0")/.."

EXPECTED_NODE="$(cat .nvmrc)"
CURRENT_NODE="$(node --version | sed 's/^v//' | cut -d. -f1)"
if [ "$CURRENT_NODE" != "${EXPECTED_NODE%%.*}" ]; then
  echo "ERROR: Node v$EXPECTED_NODE required (found $(node --version)). Run: nvm use" >&2
  exit 1
fi

if [ "${1:-}" != "--skip-install" ]; then
  echo "==> npm ci (validates package-lock.json is in sync)"
  npm ci
fi

echo "==> Lint"
npm run lint

echo "==> Format check"
npm run format:check

echo "==> Test"
npm run test:ci

echo "==> Build library"
npm run build

echo "==> Bundle size budget"
npm run size

echo "==> Build Storybook"
npm run storybook:build

echo "✅ All CI steps passed locally."
