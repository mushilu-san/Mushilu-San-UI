#!/usr/bin/env bash
# Usage: scripts/file-hunt-issues.sh [findings.tsv]
# Files one GitHub issue per row of .bug-hunt/findings.tsv (id, severity, category, title, desc, location)
# via the bloodhound open-audit-issues.sh (idempotent). Writes .bug-hunt/filed.log.
set -u
TSV="${1:-.bug-hunt/findings.tsv}"
PLUGIN=$(ls -d "$HOME/Library/Application Support/Claude/local-agent-mode-sessions/"*/*/rpm/plugin_*/scripts/open-audit-issues.sh | head -1)
: > .bug-hunt/filed.log
while IFS=$'\t' read -r id sev cat title desc loc; do
  if out=$("$PLUGIN" --new "$id" "$sev" "$cat" "$title" "$desc [$loc]" 2>&1); then
    echo "OK $id $(echo "$out" | tail -1)" >> .bug-hunt/filed.log
  else
    echo "FAILED $id $(echo "$out" | tail -1)" >> .bug-hunt/filed.log
  fi
done < "$TSV"
