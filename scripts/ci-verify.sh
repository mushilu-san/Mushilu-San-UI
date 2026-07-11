#!/usr/bin/env bash
# Usage: ./scripts/ci-verify.sh [--skip-install] [--affected[=<base-ref>]]
# Mirrors .github/workflows/ci.yml exactly: clean install -> lint -> format check -> test -> build -> size budget -> storybook build -> e2e.
# Run before pushing to catch CI failures locally. Requires the Node version from .nvmrc.
# --affected swaps the Test and E2E steps for the git-diff-scoped variants (scripts/affected.mjs),
# diffed against <base-ref> (default: origin/main) — everything else still runs in full.

set -euo pipefail
cd "$(dirname "$0")/.."

AFFECTED=false
AFFECTED_BASE="origin/main"
for arg in "$@"; do
  case "$arg" in
    --affected) AFFECTED=true ;;
    --affected=*) AFFECTED=true; AFFECTED_BASE="${arg#--affected=}" ;;
  esac
done

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

if [ "$AFFECTED" = true ]; then
  echo "==> Test (affected only, base=$AFFECTED_BASE)"
  node scripts/affected-run.mjs unit --base "$AFFECTED_BASE"
else
  echo "==> Test"
  npm run test:ci
fi

echo "==> Test release scripts"
npm run test:scripts

echo "==> Build library"
npm run build

echo "==> Bundle size budget"
npm run size

echo "==> Build Storybook"
npm run storybook:build

echo "==> Install Playwright browsers (chromium)"
npx playwright install chromium --with-deps

if [ "$AFFECTED" = true ]; then
  echo "==> E2E tests (affected only, base=$AFFECTED_BASE)"
  node scripts/affected-run.mjs e2e --base "$AFFECTED_BASE"
else
  echo "==> E2E tests"
  npm run e2e
fi

echo "✅ All CI steps passed locally."
