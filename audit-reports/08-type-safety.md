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

#### TS-1 — `event.target as HTMLInputElement` can narrow to the wrong element — ✅ RESOLVED (2026-06-15)

- **Resolution:** Changed `event.target as HTMLInputElement` → `event.currentTarget as HTMLInputElement` in `input-otp.ts` `onInput()`. `currentTarget` is always the element the listener is bound to, eliminating the bubbled-event risk.
- **File:** [projects/ui/src/lib/forms/src/input-otp/input-otp.ts](projects/ui/src/lib/forms/src/input-otp/input-otp.ts)

### LOW

#### TS-2 — Unguarded non-null assertion on `parentElement` — ✅ RESOLVED (2026-06-14)

- **Resolution:** Resolved as part of B-5. Both `startResize` and `resizeByPercent` now use `const parent = handleEl.parentElement; if (!parent) return;` before accessing `.children`.
- **File:** [projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts](projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts)

#### TS-3 — `_dragState!` mutation after a guard — ✅ RESOLVED (2026-06-15)

- **Resolution:** Captured `const state = this._dragState; if (!state) return;` at the top of `_onPointerMove`, then used `state` throughout. Removed the `!` re-assertion. `state.startPos = pos` updates the same object safely.
- **File:** [projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts](projects/ui/src/lib/layout/src/resizable/resizable-panel-group.ts)

### INFO

#### TS-4 — `@HostListener('…', ['$event'])` typed as `Event` then cast
- **Files (pattern):** [context-menu-trigger.ts:25-33](projects/ui/src/lib/overlays/src/context-menu/context-menu-trigger.ts#L25-L33) and others using `event as MouseEvent`.
- **Note:** This is the **documented** known-issue #1 workaround — Angular types `$event` as `Event` and the subtype cast is the accepted pattern. Of the 32 `as` casts, this category is the majority and is acceptable. **No action**, but consider a typed helper if it proliferates further.

---

## Categories with no findings (explicit)
- **`as any` / `as unknown`:** zero in shipped source.
- **Weak/`any` boundary types:** public inputs/outputs use precise types and `booleanAttribute`/`numberAttribute` transforms; CVA value types are concrete (`string`, `Date | null`, etc.).
- **`strict`-mode failures:** project already compiles under full `strict` + `strictTemplates`; no suppression comments (`@ts-ignore`/`@ts-expect-error`) found in source.
