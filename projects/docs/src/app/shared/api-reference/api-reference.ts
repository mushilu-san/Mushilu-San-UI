import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Badge } from '@mushilu-san/ui/primitives';
import type { ApiClass, ApiMember, ApiMemberKind } from '../../../content/api-types';
import { API_INDEX } from '../../../content/tokens';

interface MemberTable {
  kind: ApiMemberKind;
  title: string;
  rows: ApiMember[];
}

interface ClassView {
  cls: ApiClass;
  tables: MemberTable[];
}

const TABLE_ORDER: { kind: ApiMemberKind; title: string }[] = [
  { kind: 'input', title: 'Inputs' },
  { kind: 'model', title: 'Models' },
  { kind: 'output', title: 'Outputs' },
];

@Component({
  selector: 'docs-api-reference',
  imports: [Badge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './api-reference.html',
  styleUrls: ['../doc-table.css', './api-reference.css'],
})
export class ApiReference {
  readonly classes = input.required<string[]>();
  private readonly api = inject(API_INDEX);

  protected readonly views = computed<ClassView[]>(() =>
    this.classes().flatMap((name) => {
      const cls = this.api[name];
      if (!cls) return [];
      const tables = TABLE_ORDER.map(({ kind, title }) => ({
        kind,
        title,
        rows: cls.members.filter((m) => m.kind === kind),
      })).filter((t) => t.rows.length > 0);
      return [{ cls, tables }];
    }),
  );
}
