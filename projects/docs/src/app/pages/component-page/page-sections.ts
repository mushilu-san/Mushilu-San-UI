import type { ApiIndex } from '../../../content/api-types';
import type { ComponentDoc } from '../../../content/types';
import { groupInfo } from '../../../content/groups';

export interface PageSection {
  id: string;
  label: string;
}

export function pageSections(doc: ComponentDoc): PageSection[] {
  const sections: PageSection[] = [{ id: 'overview', label: 'Overview' }];
  if (doc.demos.length > 1) sections.push({ id: 'examples', label: 'Examples' });
  if (doc.guidelines) sections.push({ id: 'guidelines', label: 'Guidelines' });
  sections.push({ id: 'accessibility', label: 'Accessibility' }, { id: 'api', label: 'API' });
  if (doc.tokens?.length) sections.push({ id: 'tokens', label: 'Tokens' });
  if (doc.related?.length) sections.push({ id: 'related', label: 'Related' });
  return sections;
}

export function importStatement(doc: ComponentDoc, api: ApiIndex): string {
  const names = doc.apiClasses.filter((n) => api[n]);
  return `import { ${names.join(', ')} } from '${groupInfo(doc.group).entry}';`;
}
