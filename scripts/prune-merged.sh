#!/usr/bin/env bash
# Prune local branches and worktrees whose work already reached the base branch.
# Usage: scripts/prune-merged.sh [--apply] [--base main]
#   Default is a dry run: prints DELETE / KEEP lines. --apply performs the deletes.
#   Never touches remote branches, open or closed-unmerged PRs, dirty worktrees,
#   the base branch, or the currently checked-out branch.
set -euo pipefail

apply=0
base=main
while [ $# -gt 0 ]; do
  case "$1" in
    --apply) apply=1 ;;
    --base) base="$2"; shift ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
  shift
done

git fetch -q --prune origin

current=$(git rev-parse --abbrev-ref HEAD)
open_heads=$(gh pr list --state open --limit 1000 --json headRefName --jq '.[].headRefName')
merged_heads=$(gh pr list --state merged --limit 2000 --json headRefName --jq '.[].headRefName')
merged_tips=$(gh pr list --state merged --limit 2000 --json headRefName,headRefOid --jq '.[] | "\(.headRefName) \(.headRefOid)"')

in_list() { printf '%s\n' "$2" | grep -qxF -- "$1"; }

# "branch<TAB>worktree path" per checked-out branch (bash 3.2 has no associative arrays)
wt_map=""
wt_path=""
primary=""
while IFS= read -r line; do
  case "$line" in
    "worktree "*)
      wt_path="${line#worktree }"
      [ -z "$primary" ] && primary="$wt_path"
      ;;
    "branch refs/heads/"*) wt_map="$wt_map${line#branch refs/heads/}"$'\t'"$wt_path"$'\n' ;;
  esac
done < <(git worktree list --porcelain)
wt_of() { printf '%s' "$wt_map" | awk -F'\t' -v b="$1" '$1 == b { print $2 }'; }

for b in $(git for-each-ref --format='%(refname:short)' refs/heads); do
  if [ "$b" = "$base" ] || [ "$b" = "$current" ]; then continue; fi
  wt=$(wt_of "$b")
  if [ "$wt" = "$primary" ]; then echo "KEEP    $b (checked out in main worktree)"; continue; fi
  if in_list "$b" "$open_heads"; then echo "KEEP    $b (open PR)"; continue; fi

  reason=""
  if in_list "$b" "$merged_heads"; then
    # squash merges leave the branch ahead of base, so compare tips instead
    if in_list "$b $(git rev-parse "$b")" "$merged_tips"; then
      reason="PR merged, tip matches"
    else
      echo "KEEP    $b (PR merged but local tip differs from PR head)"
      continue
    fi
  elif git merge-base --is-ancestor "$b" "origin/$base" 2>/dev/null; then
    reason="contained in origin/$base"
  else
    echo "KEEP    $b (not merged, no merged PR)"
    continue
  fi

  if git rev-parse -q --verify "origin/$b" >/dev/null \
    && [ "$(git rev-list --count "origin/$b..$b")" -gt 0 ]; then
    echo "KEEP    $b (local commits not pushed to origin/$b)"
    continue
  fi

  if [ -n "$wt" ]; then
    if [ -n "$(git -C "$wt" status --porcelain)" ]; then
      echo "KEEP    $b (worktree $wt is dirty)"
      continue
    fi
    echo "WORKTREE  remove $wt"
    [ "$apply" = 1 ] && git worktree remove "$wt"
  fi

  echo "DELETE  $b ($reason)"
  [ "$apply" = 1 ] && git branch -D "$b" >/dev/null
done

[ "$apply" = 1 ] && git worktree prune
[ "$apply" = 0 ] && echo "dry run: pass --apply to delete"
exit 0
