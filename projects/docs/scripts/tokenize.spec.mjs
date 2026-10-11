import { describe, expect, it } from 'vitest';
import { tokenize } from './tokenize.mjs';

const kinds = (line) => line.map((tok) => `${tok.t}:${tok.v}`);
const joined = (lines) => lines.map((l) => l.map((tok) => tok.v).join('')).join('\n');

describe('tokenize (ts)', () => {
  it('classifies keywords, decorators, identifiers, strings, numbers and punctuation', () => {
    const [line] = tokenize("export const size = 'md'; // pick\n", 'ts');
    expect(kinds(line)).toEqual([
      'kw:export',
      'plain: ',
      'kw:const',
      'plain: size ',
      'punc:=',
      'plain: ',
      "str:'md'",
      'punc:;',
      'plain: ',
      'com:// pick',
    ]);
  });

  it('treats decorators as keywords and numbers as num', () => {
    const [line] = tokenize('@Component gap = 3', 'ts');
    expect(kinds(line)).toEqual(['kw:@Component', 'plain: gap ', 'punc:=', 'plain: ', 'num:3']);
  });

  it('splits multi-line block comments across lines', () => {
    const lines = tokenize('/** a\n b */\nx', 'ts');
    expect(lines).toHaveLength(3);
    expect(kinds(lines[0])).toEqual(['com:/** a']);
    expect(kinds(lines[1])).toEqual(['com: b */']);
    expect(kinds(lines[2])).toEqual(['plain:x']);
  });

  it('tokenizes a `template:` literal as HTML', () => {
    const [line] = tokenize('template: `<button muiButton variant="ghost">Go</button>`', 'ts');
    expect(kinds(line)).toEqual([
      'plain:template',
      'punc::',
      'plain: ',
      'str:`',
      'tag:<button',
      'plain: ',
      'attr:muiButton',
      'plain: ',
      'attr:variant',
      'punc:=',
      'str:"ghost"',
      'tag:>',
      'plain:Go',
      'tag:</button>',
      'str:`',
    ]);
  });

  it('keeps other template literals as a single string', () => {
    const [line] = tokenize('const s = `a ${b}`;', 'ts');
    expect(kinds(line)).toContain('str:`a ${b}`');
  });

  it('round-trips the exact source text (minus one trailing newline)', () => {
    const src = [
      "import { Component } from '@angular/core';",
      '',
      '@Component({',
      "  selector: 'docs-x',",
      '  template: `',
      '    <!-- note -->',
      '    <mui-tabs [(activeTab)]="tab" (click)="go()">',
      '      text',
      '    </mui-tabs>',
      '  `,',
      '})',
      'export class X {}',
      '',
    ].join('\n');
    expect(joined(tokenize(src, 'ts'))).toBe(src.replace(/\n$/, ''));
  });
});

describe('tokenize (html)', () => {
  it('handles comments, bound attributes and self-closing tags', () => {
    const [line] = tokenize('<!-- c --><img [src]="x" />', 'html');
    expect(kinds(line)).toEqual([
      'com:<!-- c -->',
      'tag:<img',
      'plain: ',
      'attr:[src]',
      'punc:=',
      'str:"x"',
      'plain: ',
      'tag:/>',
    ]);
  });

  it('treats a stray < that does not open a tag as text', () => {
    const [line] = tokenize('a < b', 'html');
    expect(joined([line])).toBe('a < b');
    expect(line.every((tok) => tok.t === 'plain')).toBe(true);
  });
});
