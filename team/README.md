# The Studio — a project-local agent team for Mushilu-San-UI

An original "virtual team" of specialist skills + safety hooks + a memory convention,
tailored to this Angular component library. Inspired by gstack's structure; **no gstack
dependency, no global installs** — everything lives in this repo.

## How it's wired

```
team/agents/*.agent.md   ← single source of truth (edit here)
        │  node scripts/sync-team.mjs
        ▼
.claude/skills/<name>/SKILL.md   (Claude Code slash skills)
.cursor/rules/<name>.mdc         (Cursor rules — glob-scoped / agent-requested)
.cursor/rules/00-studio-index.mdc (tiny always-on roster index)
```

Edit only `team/agents/*` (and `team/shared/claude-md-map.md`). Regenerate with
`node scripts/sync-team.mjs`; verify no drift with `node scripts/sync-team.mjs --check`.
Bodies **reference** `CLAUDE.md` sections (via `team/shared/claude-md-map.md`) instead of
copying them, so the canonical rules never fork.

## The roster

Pipeline: **Frame → Spec → Build → (Style ‖ A11y ‖ Review) → Test → QA → Size → Ship**, with
an orchestrator and a debugger off to the side.

| Agent | Slash | Stage |
|-------|-------|-------|
| Compass | `/mui-frame` | reframe the idea → brief |
| Blueprint | `/mui-spec` | lock the contract → spec |
| Foreman | `/mui-build` | drive the 9-step build |
| Palette | `/mui-style` | token & design-slop review |
| Sentinel-A11y | `/mui-a11y` | accessibility gate (can BLOCK) |
| Staff | `/mui-review` | zoneless/security/simplicity review |
| Marshal | `/mui-test` | vitest to green, ≥80% + ARIA tests |
| Prowler | `/mui-qa` | browser/Storybook QA via Playwright + regression tests |
| Gauge | `/mui-size` | per-group bundle budget |
| Quartermaster | `/mui-ship` | ci-verify + changeset + PR |
| Conductor | `/mui-autopilot` | run the whole pipeline, surface taste only |
| Sleuth | `/mui-investigate` | Iron-Law debugging |
| Scribe | `/mui-docs` | MDX/Diataxis docs sync (after ship) |
| Curator | `/mui-learn` | compounds learnings.md → CLAUDE.md (periodic) |
| Warden | `/mui-guard` | freeze/unfreeze/guard (Claude-only hook controls) |

Each agent reads upstream artifacts and writes its own under `.mui-team/`; that artifact
chain is the hand-off contract. QA scores are in `.mui-team/reports/skill-scores.md`.

## Safety hooks (Claude Code PreToolUse)

Enforced by `scripts/team-hooks/*.mjs`, wired in `.claude/settings.json`:

| Hook | Fires on | Action |
|------|----------|--------|
| careful | Bash | **ask** before `rm -rf`, force-push, `reset --hard`, `DROP`, `npm --force` |
| node-guard | Bash | **ask** (once/session) when npm/ng lacks Node-22 activation |
| lockfile-guard | Bash | **deny** `git commit` of package.json without package-lock.json |
| ci-shape-guard | Edit/Write | **deny** workflow edits that swap `npm ci`→`npm install`, hardcode Node, or drop `engines` |
| freeze | Edit/Write | **deny** edits outside the directory named in `.mui-team/freeze` |

`careful`, `node-guard`, `lockfile-guard`, `ci-shape-guard` are always on. `freeze` is
toggled by Warden (`/mui-guard`). The guards exist because this repo's CI broke for days on
exactly these mistakes (see `CLAUDE.md` §Dependency & lockfile rules).

## Memory / learning

`.mui-team/learnings.md` is an append-only, tagged log the reviewers write to. A lesson seen
**≥2×** graduates into `CLAUDE.md` §Known issues & workarounds. No new memory engine — it
complements the existing per-user memory index.

## Artifact layout

```
.mui-team/
  briefs/   <c>.brief.md          (Compass)
  specs/    <c>.spec.md           (Blueprint)
  reports/  <c>.{build,style,a11y,review,test,size,investigation,pipeline}.md
            skill-scores.md       (QA gate results)
  release-readiness.md            (Quartermaster)
  learnings.md                    (compounding lessons)
  freeze / .node-guard-ack        (transient markers — gitignored)
```
