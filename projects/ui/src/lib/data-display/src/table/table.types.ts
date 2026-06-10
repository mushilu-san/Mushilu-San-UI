export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  key: string;
  direction: SortDirection;
}
