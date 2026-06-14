# CLAUDE.md section map (canonical anchors)

Single source of truth for how Studio agents reference the rules that already live in
`CLAUDE.md`. Agents **link to these sections by name** — they never copy the rule text.
If a heading in `CLAUDE.md` (project or global) is renamed, update it **here only**; agent
bodies cite the logical key, not the raw heading.

> Convention in agent bodies: write `enforce CLAUDE.md §<Heading>` (project) or
> `global CLAUDE.md §<Heading>` (the user's `~/.claude/CLAUDE.md`).

## Project `CLAUDE.md` (`./CLAUDE.md`)

| Logical key        | Heading to cite                                              |
|--------------------|-------------------------------------------------------------|
| `lockfile-rules`   | §Dependency & lockfile rules                                |
| `node-activate`    | §Activating the correct Node version                        |
| `common-commands`  | §Common commands                                            |
| `directory-map`    | §Directory map                                              |
| `a11y`             | §Accessibility requirements                                 |
| `a11y-aria`        | §Accessibility requirements › ARIA & roles                  |
| `a11y-keyboard`    | §Accessibility requirements › Keyboard                      |
| `a11y-contrast`    | §Accessibility requirements › Color contrast (WCAG AA)      |
| `a11y-focus`       | §Accessibility requirements › Focus visibility              |
| `a11y-touch`       | §Accessibility requirements › Touch targets                 |
| `a11y-motion`      | §Accessibility requirements › Motion                        |
| `a11y-stories`     | §Accessibility requirements › Stories requirement           |
| `checklist`        | §Per-component checklist                                     |
| `known-issues`     | §Known issues & workarounds                                 |
| `add-component`    | §Adding a new component — quick recipe                      |
| `tokens`           | §Design tokens reference                                    |
| `testing-patterns` | §Testing patterns                                           |
| `backlog`          | §Component backlog — shadcn/ui parity gaps                  |
| `publishing`       | §Publishing checklist                                       |

## Global `~/.claude/CLAUDE.md`

| Logical key        | Heading to cite                                             |
|--------------------|------------------------------------------------------------|
| `build-workflow`   | global §Component build workflow — one component at a time  |
| `required-subtasks`| global §Component build workflow › Required subtasks        |
| `taskcreate-howto` | global §Component build workflow › How to use TaskCreate    |
| `automate-scripts` | global §Automate repetitive actions with scripts           |
| `response-footer`  | global §Response Footer: Rules And Skills                  |
