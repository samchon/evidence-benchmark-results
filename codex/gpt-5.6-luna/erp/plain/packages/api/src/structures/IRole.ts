import type { tags } from "typia";

/** Organization-scoped role and permission composition. */
export interface IRole {
  /** Role identifier. */
  id: string & tags.Format<"uuid">;
  /** Stable role name. */
  name: string;
  /** Built-in roles are protected from deletion. */
  builtin: boolean;
  /** Effective permission names. */
  permissions: string[];
  /** Whether the role may be assigned. */
  active: boolean;
}
export namespace IRole {
  /** Creates a custom role. */
  export interface ICreate { name: string & tags.MinLength<1>; permissions: string[]; }
  /** Changes a custom role's permission composition. */
  export interface IUpdate { permissions: string[]; active?: boolean; }
  /** Assigns a role to an active membership. */
  export interface IAssign { roleId: string & tags.Format<"uuid">; }
}
