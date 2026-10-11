// Minimal TS/HTML tokenizer for the docs code blocks.
// Runs at build time (collect-demos.mjs); the app only renders the token arrays.

const TS_KEYWORDS = new Set([
  'as',
  'async',
  'await',
  'boolean',
  'class',
  'const',
  'else',
  'export',
  'extends',
  'false',
  'for',
  'from',
  'function',
  'if',
  'implements',
  'import',
  'in',
  'interface',
  'let',
  'new',
  'null',
  'number',
  'of',
  'private',
  'protected',
  'public',
  'readonly',
  'return',
  'static',
  'string',
  'this',
  'true',
  'type',
  'undefined',
  'unknown',
  'var',
  'void',
]);

export function tokenizeHtml(src) {
  const out = [];
  const push = (t, v) => {
    if (v) out.push({ t, v });
  };
  let i = 0;
  let inTag = false;
  while (i < src.length) {
    const rest = src.slice(i);
    let m;
    if (!inTag) {
      if (rest.startsWith('<!--')) {
        const end = rest.indexOf('-->');
        const len = end === -1 ? rest.length : end + 3;
        push('com', rest.slice(0, len));
        i += len;
        continue;
      }
      if ((m = /^<\/?[A-Za-z][\w-]*/.exec(rest))) {
        push('tag', m[0]);
        inTag = true;
        i += m[0].length;
        continue;
      }
      const next = rest.indexOf('<', 1);
      const len = next === -1 ? rest.length : next;
      push('plain', rest.slice(0, len));
      i += len;
      continue;
    }
    if ((m = /^\/?>/.exec(rest))) {
      push('tag', m[0]);
      inTag = false;
    } else if ((m = /^\s+/.exec(rest))) push('plain', m[0]);
    else if ((m = /^"[^"]*"|^'[^']*'/.exec(rest))) push('str', m[0]);
    else if ((m = /^=/.exec(rest))) push('punc', m[0]);
    else if ((m = /^[^\s=>/"']+/.exec(rest))) push('attr', m[0]);
    else {
      m = [rest[0]];
      push('punc', m[0]);
    }
    i += m[0].length;
  }
  return out;
}

function findTemplateEnd(src, from) {
  for (let k = from; k < src.length; k++) {
    if (src[k] === '\\') {
      k++;
      continue;
    }
    if (src[k] === '`') return k;
  }
  return src.length;
}

function followsTemplateKey(out) {
  const significant = out.filter((tok) => tok.v.trim() !== '');
  return significant.at(-2)?.v === 'template' && significant.at(-1)?.v === ':';
}

export function tokenizeTs(src) {
  const out = [];
  const push = (t, v) => {
    if (v) out.push({ t, v });
  };
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);
    let m;
    if (rest[0] === '`') {
      const end = findTemplateEnd(src, i + 1);
      const body = src.slice(i + 1, end);
      const asHtml = followsTemplateKey(out);
      push('str', '`');
      if (asHtml) out.push(...tokenizeHtml(body));
      else push('str', body);
      if (end < src.length) push('str', '`');
      i = Math.min(end + 1, src.length);
      continue;
    }
    if ((m = /^\/\/[^\n]*/.exec(rest)) || (m = /^\/\*[\s\S]*?\*\//.exec(rest))) push('com', m[0]);
    else if ((m = /^'(?:\\.|[^'\\\n])*'|^"(?:\\.|[^"\\\n])*"/.exec(rest))) push('str', m[0]);
    else if ((m = /^\d+(?:\.\d+)?/.exec(rest))) push('num', m[0]);
    else if ((m = /^@?[A-Za-z_$][\w$]*/.exec(rest))) {
      push(m[0].startsWith('@') || TS_KEYWORDS.has(m[0]) ? 'kw' : 'plain', m[0]);
    } else if ((m = /^\s+/.exec(rest))) push('plain', m[0]);
    else {
      m = [rest[0]];
      push('punc', m[0]);
    }
    i += m[0].length;
  }
  return out;
}

export function toLines(tokens) {
  const lines = [[]];
  for (const { t, v } of tokens) {
    v.split('\n').forEach((part, idx) => {
      if (idx > 0) lines.push([]);
      if (!part) return;
      const line = lines[lines.length - 1];
      const prev = line[line.length - 1];
      if (prev && prev.t === t) prev.v += part;
      else line.push({ t, v: part });
    });
  }
  return lines;
}

export function tokenize(source, lang) {
  const src = source.replace(/\n$/, '');
  return toLines(lang === 'html' ? tokenizeHtml(src) : tokenizeTs(src));
}
