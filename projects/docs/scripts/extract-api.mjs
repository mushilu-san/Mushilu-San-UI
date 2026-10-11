// Extracts the public signal API (input/output/model), service methods and CSS parts
// from the library's group entry points. Output: projects/docs/src/generated/api.ts
// Usage: node projects/docs/scripts/extract-api.mjs [--print-classes]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

export const GROUPS = [
  'primitives',
  'forms',
  'layout',
  'navigation',
  'feedback',
  'data-display',
  'mobile',
  'overlays',
];

const SIGNAL_FNS = { input: 'input', output: 'output', model: 'model' };

function decoratorInfo(node) {
  for (const dec of ts.getDecorators(node) ?? []) {
    const call = dec.expression;
    if (!ts.isCallExpression(call) || !ts.isIdentifier(call.expression)) continue;
    const name = call.expression.text;
    if (name !== 'Component' && name !== 'Directive' && name !== 'Injectable') continue;
    const arg = call.arguments[0];
    const props = arg && ts.isObjectLiteralExpression(arg) ? arg.properties : [];
    return { name, props };
  }
  return undefined;
}

function stringProp(props, key) {
  for (const p of props) {
    if (
      ts.isPropertyAssignment(p) &&
      p.name.getText() === key &&
      ts.isStringLiteralLike(p.initializer)
    ) {
      return p.initializer.text;
    }
  }
  return undefined;
}

function hostParts(props) {
  const parts = [];
  for (const p of props) {
    if (!ts.isPropertyAssignment(p) || p.name.getText() !== 'host') continue;
    if (!ts.isObjectLiteralExpression(p.initializer)) continue;
    for (const hp of p.initializer.properties) {
      if (!ts.isPropertyAssignment(hp) || !ts.isStringLiteralLike(hp.name)) continue;
      if (hp.name.text !== '[attr.part]' || !ts.isStringLiteralLike(hp.initializer)) continue;
      const m = /^["'](.+)["']$/.exec(hp.initializer.text);
      if (m) parts.push(...m[1].split(/\s+/));
    }
  }
  return parts;
}

function templateParts(props, sourceFile) {
  let html = stringProp(props, 'template') ?? '';
  const url = stringProp(props, 'templateUrl');
  if (url) {
    const file = resolve(dirname(sourceFile.fileName), url);
    if (existsSync(file)) html = readFileSync(file, 'utf8');
  }
  const parts = [];
  for (const m of html.matchAll(/\bpart="([^"]+)"/g)) parts.push(...m[1].trim().split(/\s+/));
  return parts;
}

function signalCall(init) {
  if (!init || !ts.isCallExpression(init)) return undefined;
  const callee = init.expression;
  if (ts.isIdentifier(callee) && SIGNAL_FNS[callee.text]) {
    return { kind: SIGNAL_FNS[callee.text], required: false, call: init };
  }
  if (
    ts.isPropertyAccessExpression(callee) &&
    ts.isIdentifier(callee.expression) &&
    (callee.expression.text === 'input' || callee.expression.text === 'model') &&
    callee.name.text === 'required'
  ) {
    return { kind: callee.expression.text, required: true, call: init };
  }
  return undefined;
}

function optionsArg(sig) {
  const { kind, required, call } = sig;
  const idx = kind === 'output' || required ? 0 : 1;
  const arg = call.arguments[idx];
  return arg && ts.isObjectLiteralExpression(arg) ? arg : undefined;
}

function optionValue(obj, key) {
  if (!obj) return undefined;
  for (const p of obj.properties) {
    if (ts.isPropertyAssignment(p) && p.name.getText() === key) {
      return ts.isStringLiteralLike(p.initializer) ? p.initializer.text : p.initializer.getText();
    }
  }
  return undefined;
}

function isLiteral(t) {
  return Boolean(
    t.flags &
    (ts.TypeFlags.StringLiteral | ts.TypeFlags.NumberLiteral | ts.TypeFlags.BooleanLiteral),
  );
}

function printType(checker, t) {
  if (t.isUnion()) {
    const nullish = t.types.filter((m) => m.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null));
    const rest = t.types.filter((m) => !nullish.includes(m));
    if (rest.length > 0 && rest.every(isLiteral)) {
      const names = rest.map((m) => checker.typeToString(m).replace(/^"(.*)"$/, "'$1'"));
      const hasTrue = names.includes('true');
      const hasFalse = names.includes('false');
      const merged =
        hasTrue && hasFalse
          ? ['boolean', ...names.filter((n) => n !== 'true' && n !== 'false')]
          : names;
      return [...merged, ...nullish.map((m) => checker.typeToString(m))].join(' | ');
    }
  }
  return checker.typeToString(t, undefined, ts.TypeFormatFlags.NoTruncation);
}

function valueType(checker, prop) {
  const t = checker.getTypeAtLocation(prop.name);
  const args = t.flags & ts.TypeFlags.Object ? checker.getTypeArguments(t) : [];
  return printType(checker, args[0] ?? t);
}

function jsdoc(checker, node) {
  const sym = node.name ? checker.getSymbolAtLocation(node.name) : undefined;
  const description = sym
    ? ts.displayPartsToString(sym.getDocumentationComment(checker)).trim()
    : '';
  const dep = ts.getJSDocTags(node).find((tag) => tag.tagName.text === 'deprecated');
  const deprecated = dep ? (ts.getTextOfJSDocComment(dep.comment) ?? '').trim() : undefined;
  return { description: description || undefined, deprecated };
}

function extractMember(checker, prop) {
  const sig = signalCall(prop.initializer);
  if (!sig) return undefined;
  const opts = optionsArg(sig);
  const first = sig.call.arguments[0];
  const { description, deprecated } = jsdoc(checker, prop);
  const member = {
    name: optionValue(opts, 'alias') ?? prop.name.getText(),
    kind: sig.kind,
    type: valueType(checker, prop),
    required: sig.required,
  };
  if (sig.kind !== 'output' && !sig.required && first && !ts.isObjectLiteralExpression(first)) {
    member.default = first.getText();
  }
  const transform = optionValue(opts, 'transform');
  if (transform) member.transform = transform;
  if (description) member.description = description;
  if (deprecated !== undefined) member.deprecated = deprecated;
  return member;
}

function isPublicMethod(m) {
  const mods = ts.getModifiers(m) ?? [];
  const hidden = mods.some(
    (x) => x.kind === ts.SyntaxKind.PrivateKeyword || x.kind === ts.SyntaxKind.ProtectedKeyword,
  );
  return !hidden && !m.name.getText().startsWith('_') && !m.name.getText().startsWith('#');
}

function extractClass(checker, node, group) {
  const info = decoratorInfo(node);
  if (!info || !node.name) return undefined;
  const kind =
    info.name === 'Component' ? 'component' : info.name === 'Directive' ? 'directive' : 'service';
  const cls = { name: node.name.text, group, kind, members: [], methods: [], parts: [] };
  const selector = stringProp(info.props, 'selector');
  const providedIn = stringProp(info.props, 'providedIn');
  if (selector) cls.selector = selector;
  if (providedIn) cls.providedIn = providedIn;

  for (const el of node.members) {
    if (ts.isPropertyDeclaration(el)) {
      const member = extractMember(checker, el);
      if (member) cls.members.push(member);
    } else if (kind === 'service' && ts.isMethodDeclaration(el) && isPublicMethod(el)) {
      const signature = checker.signatureToString(checker.getSignatureFromDeclaration(el));
      const { description } = jsdoc(checker, el);
      cls.methods.push({
        name: el.name.getText(),
        signature,
        ...(description ? { description } : {}),
      });
    }
  }
  cls.parts = [
    ...new Set([...hostParts(info.props), ...templateParts(info.props, node.getSourceFile())]),
  ].sort();
  return cls;
}

export function extractApi(entries) {
  const program = ts.createProgram(
    entries.map((e) => e.file),
    {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.Preserve,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      experimentalDecorators: true,
      strict: true,
      skipLibCheck: true,
      noEmit: true,
    },
  );
  const checker = program.getTypeChecker();
  const api = {};
  for (const { group, file } of entries) {
    const source = program.getSourceFile(file);
    const moduleSym = source && checker.getSymbolAtLocation(source);
    if (!moduleSym) throw new Error(`Cannot load entry point ${file}`);
    for (const exp of checker.getExportsOfModule(moduleSym)) {
      const sym = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp;
      const decl = sym.declarations?.find(ts.isClassDeclaration);
      if (!decl) continue;
      const cls = extractClass(checker, decl, group);
      if (!cls) continue;
      const existing = api[cls.name];
      if (existing && existing.group !== group) {
        throw new Error(
          `Duplicate exported class name "${cls.name}" in groups "${existing.group}" and "${group}"; the API index is keyed by class name.`,
        );
      }
      api[cls.name] = cls;
    }
  }
  return api;
}

export function jsdocCoverage(api) {
  let documented = 0;
  let total = 0;
  for (const cls of Object.values(api)) {
    for (const m of cls.members) {
      total++;
      if (m.description) documented++;
    }
  }
  return { documented, total };
}

export function renderModule(api) {
  return [
    '// AUTO-GENERATED by projects/docs/scripts/extract-api.mjs — do not edit.',
    "import type { ApiIndex } from '../content/api-types';",
    '',
    `export const API: ApiIndex = ${JSON.stringify(api, null, 2)};`,
    '',
  ].join('\n');
}

function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
  const entries = GROUPS.map((group) => ({
    group,
    file: resolve(root, `projects/ui/src/lib/${group}/src/public-api.ts`),
  }));
  const api = extractApi(entries);
  if (process.argv.includes('--print-classes')) {
    console.log(JSON.stringify(Object.keys(api).sort(), null, 2));
    return;
  }
  const out = resolve(root, 'projects/docs/src/generated/api.ts');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, renderModule(api));
  const { documented, total } = jsdocCoverage(api);
  console.log(`extract-api: ${Object.keys(api).length} classes → ${out}`);
  console.log(`JSDoc coverage: ${documented}/${total} members documented`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
