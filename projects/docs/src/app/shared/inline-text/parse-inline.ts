export type InlineSegment =
  | { kind: 'text'; value: string }
  | { kind: 'code'; value: string }
  | { kind: 'link'; value: string; slug: string };

const PATTERN = /`([^`]+)`|\[([^\]]+)\]\(([a-z0-9-]+)\)/g;

/** Parses the two inline forms docs content supports: `code` and [label](slug). */
export function parseInline(text: string): InlineSegment[] {
  const out: InlineSegment[] = [];
  let last = 0;
  for (const m of text.matchAll(PATTERN)) {
    const index = m.index;
    if (index > last) out.push({ kind: 'text', value: text.slice(last, index) });
    const [whole, code, label, slug] = m;
    if (code !== undefined) out.push({ kind: 'code', value: code });
    else if (label !== undefined && slug !== undefined)
      out.push({ kind: 'link', value: label, slug });
    last = index + whole.length;
  }
  if (last < text.length) out.push({ kind: 'text', value: text.slice(last) });
  return out;
}
