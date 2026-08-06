import type { tags } from "typia";

/** Organization-scoped built-in or custom role. */
/**
 * @evidence prisma:roles Exposes the persisted roles record.
 */
export interface IRole {
  /** @evidence prisma:roles.id Carries the persisted id value. */ id: string & tags.Format<"uuid">;
  /** @evidence prisma:roles.name Carries the persisted name value. */ name: string;
  /** @evidence prisma:roles.built_in Carries the persisted built_in value. */ builtIn: boolean;
  permissions: string[];
  /** @evidence prisma:roles.created_at Carries the persisted created_at value. */ createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:roles.updated_at Carries the persisted updated_at value. */ updatedAt: string & tags.Format<"date-time">;
}
export namespace IRole {
  export interface ICreate { name: string & tags.MinLength<1>; permissions?: string[]; }
  export interface IUpdate { name?: string & tags.MinLength<1>; permissions?: string[]; }
  export interface IAssign { membershipId: string & tags.Format<"uuid">; roleId: string & tags.Format<"uuid">; }
  export interface IRevoke { membershipId: string & tags.Format<"uuid">; roleId: string & tags.Format<"uuid">; }
}
