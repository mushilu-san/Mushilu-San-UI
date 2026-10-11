export type ApiMemberKind = 'input' | 'output' | 'model';

export interface ApiMember {
  /** Public binding name (alias if one is declared). */
  name: string;
  kind: ApiMemberKind;
  type: string;
  default?: string;
  required: boolean;
  transform?: string;
  description?: string;
  /** Present when the member carries `@deprecated`; holds the tag text (may be empty). */
  deprecated?: string;
}

export interface ApiMethod {
  name: string;
  signature: string;
  description?: string;
}

export interface ApiClass {
  name: string;
  group: string;
  kind: 'component' | 'directive' | 'service';
  selector?: string;
  providedIn?: string;
  members: ApiMember[];
  methods: ApiMethod[];
  parts: string[];
}

export type ApiIndex = Record<string, ApiClass>;
