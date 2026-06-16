# Studio learnings (append-only)

One line per lesson, tagged. Written by the reviewer agents (Palette, Sentinel-A11y,
Staff, Marshal, Sleuth, Bloodhound hunt squad) and by `/mui-investigate`. A lesson seen
**≥2×** graduates into `CLAUDE.md` §Known issues & workarounds (the canonical home for
hard rules).

Tags: `#a11y` `#contrast` `#tokens` `#zoneless` `#testing` `#security` `#ng-packagr`
`#lockfile` `#size` `#perf` `#dead-code` `#dependency` `#duplication` `#e2e`.

<!-- newest first -->
- (seed) #zoneless Element-selector host roles are lost in renderComponent's wrapper —
  query inner roles with `within(host)`. (example from Sleuth's worked case)
