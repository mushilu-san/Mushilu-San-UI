import { parseInline } from './parse-inline';

describe('parseInline', () => {
  it('returns a single text segment for plain text', () => {
    expect(parseInline('Hello')).toEqual([{ kind: 'text', value: 'Hello' }]);
  });

  it('parses code and links in order', () => {
    expect(parseInline('Use `muiButton` or see [Dialog](dialog).')).toEqual([
      { kind: 'text', value: 'Use ' },
      { kind: 'code', value: 'muiButton' },
      { kind: 'text', value: ' or see ' },
      { kind: 'link', value: 'Dialog', slug: 'dialog' },
      { kind: 'text', value: '.' },
    ]);
  });

  it('leaves malformed markup as text', () => {
    expect(parseInline('a `b and [c](Not A Slug)')).toEqual([
      { kind: 'text', value: 'a `b and [c](Not A Slug)' },
    ]);
  });

  it('returns no segments for an empty string', () => {
    expect(parseInline('')).toEqual([]);
  });
});
