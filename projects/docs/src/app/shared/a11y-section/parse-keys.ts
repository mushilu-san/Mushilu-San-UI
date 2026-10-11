/** 'Shift+Tab / Tab' → [['Shift','Tab'], ['Tab']] */
export function parseKeys(keys: string): string[][] {
  return keys.split(' / ').map((alt) =>
    alt
      .split('+')
      .map((k) => k.trim())
      .filter(Boolean),
  );
}
