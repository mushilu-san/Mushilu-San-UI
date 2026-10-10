export type TokenKind = 'kw' | 'str' | 'com' | 'num' | 'tag' | 'attr' | 'punc' | 'plain';

export interface CodeToken {
  t: TokenKind;
  v: string;
}

export type CodeLines = CodeToken[][];

export interface DemoSource {
  source: string;
  lines: CodeLines;
}

export type DemoSourceIndex = Record<string, DemoSource>;
