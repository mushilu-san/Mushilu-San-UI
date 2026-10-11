import { API } from '../generated/api';
import { DEMO_SOURCES } from '../generated/demo-sources';
import { parseInline } from '../app/shared/inline-text/parse-inline';
import { GROUPS } from './groups';
import { REGISTRY } from './registry';
import type { ComponentDoc } from './types';
import undocumented from './undocumented.json';

function allStrings(doc: ComponentDoc): string[] {
  return [
    doc.summary,
    ...doc.description,
    ...doc.whenToUse,
    ...doc.whenNotToUse.map((w) => w.text),
    ...doc.demos.flatMap((d) => [d.title, d.description ?? '']),
    ...(doc.guidelines ? [...doc.guidelines.do, ...doc.guidelines.dont] : []),
    ...doc.a11y.notes,
    ...doc.a11y.roles.map((r) => r.notes ?? ''),
    ...doc.a11y.keyboard.map((k) => k.action),
  ];
}

describe('docs registry consistency', () => {
  let docs: ComponentDoc[] = [];
  const slugs = new Set(REGISTRY.map((e) => e.slug));

  beforeAll(async () => {
    docs = await Promise.all(REGISTRY.map((e) => e.load()));
  });

  it('has unique slugs', () => {
    expect(slugs.size).toBe(REGISTRY.length);
  });

  it('only uses known groups', () => {
    const groupIds = new Set(GROUPS.map((g) => g.id));
    for (const e of REGISTRY) expect(groupIds.has(e.group)).toBe(true);
  });

  it('keeps registry metadata in sync with each docs file', () => {
    REGISTRY.forEach((entry, i) => {
      const doc = docs[i];
      expect(doc).toBeDefined();
      expect({
        slug: doc?.slug,
        name: doc?.name,
        group: doc?.group,
        summary: doc?.summary,
      }).toEqual({
        slug: entry.slug,
        name: entry.name,
        group: entry.group,
        summary: entry.summary,
      });
    });
  });

  it('references only API classes that exist', () => {
    for (const doc of docs) {
      for (const cls of doc.apiClasses) expect(API[cls], `${doc.slug} → ${cls}`).toBeDefined();
    }
  });

  it('has a collected source for every demo', () => {
    for (const doc of docs) {
      expect(doc.demos.length, `${doc.slug} needs at least one demo`).toBeGreaterThan(0);
      for (const demo of doc.demos) expect(DEMO_SOURCES[demo.id], demo.id).toBeDefined();
    }
  });

  it('links only to documented slugs', () => {
    for (const doc of docs) {
      const targets = [
        ...doc.whenNotToUse.flatMap((w) => (w.alternative ? [w.alternative] : [])),
        ...(doc.related ?? []),
        ...allStrings(doc).flatMap((s) =>
          parseInline(s).flatMap((seg) => (seg.kind === 'link' ? [seg.slug] : [])),
        ),
      ];
      for (const t of targets)
        expect(slugs.has(t), `${doc.slug} links to unknown "${t}"`).toBe(true);
    }
  });

  it('covers every exported library class exactly once (page or undocumented.json)', () => {
    const documented = new Set(docs.flatMap((d) => d.apiClasses));
    const pending = new Set<string>(undocumented);
    const overlap = [...documented].filter((c) => pending.has(c));
    const missing = Object.keys(API).filter((c) => !documented.has(c) && !pending.has(c));
    const stale = [...pending].filter((c) => !API[c]);
    expect({ overlap, missing, stale }).toEqual({ overlap: [], missing: [], stale: [] });
  });
});
