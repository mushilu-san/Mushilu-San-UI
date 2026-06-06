#!/usr/bin/env bash
# dev.sh — Mushilu-San-UI development helper
#
# Activates Node 22 via nvm before every command so Angular 21 works
# even when the default Node is 20.x.
#
# Usage:
#   ./dev.sh <command> [args]
#
# Commands:
#   build             Build the library (all entry points)
#   test              Run unit tests with coverage (interactive watch)
#   test:ci           Run unit tests with coverage (single pass, for CI)
#   storybook         Start Storybook dev server on port 6006
#   storybook:build   Build Storybook static output → storybook-static/
#   changeset         Add a changeset (run before merging a PR)
#   version-packages  Bump versions + update CHANGELOG from changesets
#   release           Build + publish to npm (runs changeset publish)
#   lint              Run ESLint on the library
#   clean             Delete dist/ coverage/ storybook-static/
#   help              Show this help text

set -euo pipefail

# ── Activate Node 22 via nvm ─────────────────────────────────────────────────
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck source=/dev/null
  source "$NVM_DIR/nvm.sh"
  nvm use 22 --silent 2>/dev/null || {
    echo "Node 22 not installed. Installing…"
    nvm install 22 --lts
    nvm use 22
  }
else
  echo "⚠  nvm not found at $NVM_DIR — make sure Node 22 is active." >&2
fi

# ── Resolve script directory ─────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── Local Angular CLI shortcut ───────────────────────────────────────────────
_NG_LOCAL="$SCRIPT_DIR/node_modules/.bin/ng"
if [[ -x "$_NG_LOCAL" ]]; then
  run_ng() { "$_NG_LOCAL" "$@"; }
else
  run_ng() { npx @angular/cli@21 "$@"; }
fi

COMMAND="${1:-help}"

case "$COMMAND" in

  build)
    echo "▶ Building @mushilu-san/ui…"
    run_ng build ui
    echo "✔ Built → dist/ui"
    ;;

  test)
    echo "▶ Running tests (watch mode)…"
    run_ng test ui
    ;;

  test:ci)
    echo "▶ Running tests (single pass + coverage)…"
    run_ng test ui --no-watch
    ;;

  storybook)
    echo "▶ Starting Storybook on http://localhost:6006 …"
    npm run storybook
    ;;

  storybook:build)
    echo "▶ Building Storybook static output…"
    npm run storybook:build
    echo "✔ Output → storybook-static/"
    ;;

  changeset)
    echo "▶ Creating a changeset…"
    npm run changeset
    ;;

  version-packages)
    echo "▶ Bumping versions and updating CHANGELOG…"
    npm run version-packages
    ;;

  release)
    echo "▶ Building and publishing to npm…"
    npm run release
    ;;

  lint)
    echo "▶ Linting…"
    run_ng lint ui
    ;;

  clean)
    echo "▶ Cleaning build artefacts…"
    rm -rf dist/ coverage/ storybook-static/ out-tsc/
    echo "✔ Cleaned"
    ;;

  help | --help | -h)
    # Print header block (lines 2–end-of-header, before first blank comment)
    awk '/^#!/{next} /^#/{print substr($0,3)} /^$/{exit}' "$0"
    ;;

  *)
    echo "Unknown command: $COMMAND" >&2
    echo "Run './dev.sh help' for usage." >&2
    exit 1
    ;;

esac
