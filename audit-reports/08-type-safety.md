# 08 — Type Safety

## Executive summary
- **Critical: 0 · High: 0 · Medium: 1 · Low: 2 · Info: 1**
- Type discipline is **strong**: `tsconfig.json` enables `strict: true`, `strictTemplates`, `strictInjectionParameters`, and `strictInputAccessModifiers`. There are **zero `as any`** and **zero `as unknown`** casts in shipped source.
- The remaining surface is small: **32 `as <Type>` casts** (almost all `event.target as HTMLElement`/`nativeElement` narrowing) and **3 non-null `!` assertions** (`parentElement!`, `_dragState!`), plus the documented `@HostListener` `$event: Event` cast workaround.
- The one cast worth tightening is `event.target as HTMLInputElement` (can be wrong on bubbled events); the rest are idiomatic Angular DOM narrowing.
- Top 3 priorities: (1) prefer `currentTarget`/instanceof over `event.target as …`; (2) remove the unguarded `parentElement!`; (3) keep `strict`/`strictTemplates` on (no regressions).

---

## Findings

### MEDIUM

#### TS-1 — `event.target as HTMLInputElement` can narrow to the wrong element
- **File:** [projects/ui/src/lib/forms/src/input-otp/input-otp.ts:71](projects/ui/src/lib/forms/src/input-otp/input-otp.ts#L71)
- **Evidence:** `const inp = event.target as HTMLInputElement;`
- **Why it matters:** `event.target` is the element that originated the event, which on a bubbled/delegated handler may not be the `<input>` the code assumes; the `as` cast hides this. Here the handler is bound per-input so it's currently safe, but the pattern is fragile and used in several controls.
- **Fix:** Use `event.currentTarget as HTMLInputElement` (the element the listener is attached to) or guard: `if (!(event.target instanceof HTMLInputElement)) return;`. Apply the same to other `event.target as …` sites.

### LOW

#### TS-2 — Unguarded non-null assertion on `parentElement`
- **File:** [projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts:81,123](projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts#L81)
- **Evidence:** `handleEl.parentElement!.children`
- **Why it matters:** `!` defeats `strictNullChecks` exactly where a null is plausible (detached element/teardown), turning a compile-time guarantee into a runtime `TypeError`. (Also tracked as bug B-5.)
- **Fix:** Narrow with an explicit guard instead of `!`.

#### TS-3 — `_dragState!` mutation after a guard
- **File:** [projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts:118](projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts#L118)
- **Evidence:** `this._dragState!.startPos = pos;` inside `ngZone.run(...)`
- **Why it matters:** The earlier `if (!this._dragState) return;` makes this safe *today*, but the `!` re-asserts non-null across an async/callback boundary where `_onPointerUp` could have nulled it. Low risk, but the `!` masks the reasoning.
- **Fix:** Capture `const state = this._dragState; if (!state) return;` once and use `state` throughout the handler.

### INFO

#### TS-4 — `@HostListener('…', ['$event'])` typed as `Event` then cast
- **Files (pattern):** [context-menu-trigger.ts:25-33](projects/ui/src/lib/overlays/src/context-menu/context-menu-trigger.ts#L25-L33) and others using `event as MouseEvent`.
- **Note:** This is the **documented** known-issue #1 workaround — Angular types `$event` as `Event` and the subtype cast is the accepted pattern. Of the 32 `as` casts, this category is the majority and is acceptable. **No action**, but consider a typed helper if it proliferates further.

---

## Categories with no findings (explicit)
- **`as any` / `as unknown`:** zero in shipped source.
- **Weak/`any` boundary types:** public inputs/outputs use precise types and `booleanAttribute`/`numberAttribute` transforms; CVA value types are concrete (`string`, `Date | null`, etc.).
- **`strict`-mode failures:** project already compiles under full `strict` + `strictTemplates`; no suppression comments (`@ts-ignore`/`@ts-expect-error`) found in source.
