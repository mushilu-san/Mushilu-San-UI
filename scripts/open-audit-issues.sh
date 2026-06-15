#!/usr/bin/env bash
# scripts/open-audit-issues.sh
# Manage GitHub issues for Mushilu-San-UI audit findings.
#
# Usage:
#   ./scripts/open-audit-issues.sh                                              # bulk: all findings in audit-findings.json
#   ./scripts/open-audit-issues.sh --new <ID> <SEVERITY> <CATEGORY> "<TITLE>" "<DESC>"  # open one new finding issue
#   ./scripts/open-audit-issues.sh --resolve <ID>                              # close a finding issue + mark resolved in JSON
#
# Idempotent: bulk and --new skip findings whose title already exists as an issue.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FINDINGS_JSON="$SCRIPT_DIR/audit-findings.json"

# ---------------------------------------------------------------------------
# Labels
# ---------------------------------------------------------------------------
ensure_labels() {
  echo "→ Ensuring labels exist…"
  # Format: "name|color|description"  (pipe-delimited to avoid clash with colon in label names)
  local labels=(
    "audit|0075ca|Audit finding"
    "resolved|0e8a16|Finding resolved"
    "severity:critical|d73a4a|Critical severity"
    "severity:high|e4e669|High severity"
    "severity:medium|f9d0c4|Medium severity"
    "severity:low|cfd3d7|Low severity"
    "severity:info|e1f7f3|Informational — no action needed"
    "category:security|d4c5f9|Security finding"
    "category:performance|fef2c0|Performance finding"
    "category:decomposition|c2e0c6|Decomposition / duplication finding"
    "category:bugs|d73a4a|Bug finding"
    "category:tests|0075ca|Missing unit test finding"
    "category:e2e|006b75|Missing E2E test finding"
    "category:accessibility|e99695|Accessibility finding"
    "category:types|bfd4f2|Type safety finding"
    "category:dead-code|eeeeee|Dead code finding"
    "category:dependency|fbca04|Dependency health finding"
  )
  for entry in "${labels[@]}"; do
    IFS='|' read -r name color desc <<< "$entry"
    gh label create "$name" --color "$color" --description "$desc" --force 2>/dev/null || true
  done
}

# ---------------------------------------------------------------------------
# Create a single issue; returns the issue number via stdout
# ---------------------------------------------------------------------------
create_issue() {
  local id="$1" severity="$2" category="$3" file="$4" title="$5" description="$6" resolved="$7" resolved_note="$8"

  local issue_title="[AUDIT] $id: $title"

  # Idempotency check
  local count
  count=$(gh issue list --search "in:title \"[AUDIT] $id:\"" --state all --json number --jq 'length' 2>/dev/null || echo 0)
  if [ "$count" -gt 0 ]; then
    echo "  skip $id — issue already exists"
    return 0
  fi

  local status_line
  if [ "$resolved" = "true" ]; then
    status_line="✅ **Resolved** — $resolved_note"
  else
    status_line="🔴 **Open** — not yet addressed"
  fi

  local body
  body="## [AUDIT] $id — $title

**Severity:** $severity
**Category:** $category
**Audit report:** [\`audit-reports/$file\`](audit-reports/$file)
**Status:** $status_line

---

$description"

  local labels="audit,severity:$severity,category:$category"
  if [ "$resolved" = "true" ]; then
    labels="$labels,resolved"
  fi

  local url
  url=$(gh issue create \
    --title "$issue_title" \
    --body "$body" \
    --label "$labels")

  local number
  number="${url##*/}"

  if [ "$resolved" = "true" ]; then
    gh issue close "$number" --comment "Resolved — see resolvedNote in audit-findings.json for details." > /dev/null
  fi

  echo "  ✓ #$number $id (resolved=$resolved)"
}

# ---------------------------------------------------------------------------
# Mode: bulk (no args) — create issues for all findings in JSON
# ---------------------------------------------------------------------------
bulk_mode() {
  ensure_labels
  echo "→ Processing $(jq 'length' "$FINDINGS_JSON") findings…"
  local count=0
  while IFS= read -r row; do
    id=$(echo "$row" | jq -r '.id')
    severity=$(echo "$row" | jq -r '.severity')
    category=$(echo "$row" | jq -r '.category')
    file=$(echo "$row" | jq -r '.file')
    title=$(echo "$row" | jq -r '.title')
    description=$(echo "$row" | jq -r '.description')
    resolved=$(echo "$row" | jq -r '.resolved')
    resolved_note=$(echo "$row" | jq -r '.resolvedNote')
    create_issue "$id" "$severity" "$category" "$file" "$title" "$description" "$resolved" "$resolved_note"
    count=$((count + 1))
  done < <(jq -c '.[]' "$FINDINGS_JSON")
  echo "→ Done. Processed $count findings."
}

# ---------------------------------------------------------------------------
# Mode: --new <ID> <SEVERITY> <CATEGORY> "<TITLE>" "<DESC>"
# ---------------------------------------------------------------------------
new_mode() {
  local id="$2" severity="$3" category="$4" title="$5" description="$6"
  ensure_labels

  create_issue "$id" "$severity" "$category" "—" "$title" "$description" "false" ""
  local number
  number=$(gh issue list --search "in:title \"[AUDIT] $id:\"" --state open --json number --jq '.[0].number' 2>/dev/null || echo "")

  # Append to JSON
  local new_entry
  new_entry=$(jq -n \
    --arg id "$id" \
    --arg severity "$severity" \
    --arg category "$category" \
    --arg title "$title" \
    --arg description "$description" \
    '{id:$id,severity:$severity,category:$category,file:"—",title:$title,description:$description,resolved:false,resolvedNote:""}')

  local tmp
  tmp=$(mktemp)
  jq --argjson entry "$new_entry" '. + [$entry]' "$FINDINGS_JSON" > "$tmp"
  mv "$tmp" "$FINDINGS_JSON"

  echo "→ Created issue #$number for $id and appended to audit-findings.json"
}

# ---------------------------------------------------------------------------
# Mode: --resolve <ID>
# ---------------------------------------------------------------------------
resolve_mode() {
  local id="$2"

  local number
  number=$(gh issue list --search "in:title \"[AUDIT] $id:\"" --state open --json number --jq '.[0].number' 2>/dev/null || echo "")

  if [ -z "$number" ] || [ "$number" = "null" ]; then
    echo "✗ No open issue found for $id"
    exit 1
  fi

  gh issue edit "$number" --add-label resolved > /dev/null
  gh issue close "$number" --comment "Resolved — closing this issue." > /dev/null

  # Update JSON: set resolved:true for this ID
  local tmp
  tmp=$(mktemp)
  jq --arg id "$id" \
    'map(if .id == $id then .resolved = true else . end)' \
    "$FINDINGS_JSON" > "$tmp"
  mv "$tmp" "$FINDINGS_JSON"

  echo "→ Closed #$number for $id and marked resolved in audit-findings.json"
}

# ---------------------------------------------------------------------------
# Dispatch
# ---------------------------------------------------------------------------
case "${1:-}" in
  --new)
    if [ "$#" -lt 6 ]; then
      echo "Usage: $0 --new <ID> <SEVERITY> <CATEGORY> \"<TITLE>\" \"<DESC>\""
      exit 1
    fi
    new_mode "$@"
    ;;
  --resolve)
    if [ "$#" -lt 2 ]; then
      echo "Usage: $0 --resolve <ID>"
      exit 1
    fi
    resolve_mode "$@"
    ;;
  *)
    bulk_mode
    ;;
esac
