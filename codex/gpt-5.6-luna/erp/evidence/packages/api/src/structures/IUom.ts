import type { tags } from "typia";

/** Organization-scoped unit of measure. */
/**
 * @evidence prisma:uoms Exposes the persisted uoms record.
 */
export interface IUom {
  /** Unit UUID. */
  /** @evidence prisma:uoms.id Carries the persisted id value. */ id: string & tags.Format<"uuid">;
  /** Unit code. */
  /** @evidence prisma:uoms.code Carries the persisted code value. */ code: string;
  /** Display name. */
  /** @evidence prisma:uoms.name Carries the persisted name value. */ name: string;
  /** Unit category. */
  /** @evidence prisma:uoms.category Carries the persisted category value. */ category: string;
  /** Whether selectable for new quantities. */
  /** @evidence prisma:uoms.active Carries the persisted active value. */ active: boolean;
  /** Creation instant. */
  /** @evidence prisma:uoms.created_at Carries the persisted created_at value. */ createdAt: string & tags.Format<"date-time">;
  /** Last revision instant. */
  /** @evidence prisma:uoms.updated_at Carries the persisted updated_at value. */ updatedAt: string & tags.Format<"date-time">;
}
export namespace IUom {
  /** Unit creation input. */
  export interface ICreate {
    /** Unit code. */
    code: string & tags.MinLength<1>;
    /** Display name. */
    name: string & tags.MinLength<1>;
    /** Unit category. */
    category: string & tags.MinLength<1>;
  }
  /** Unit update input. */
  export interface IUpdate extends Partial<Omit<ICreate, "code">> {}
  /** Unit list request. */
  export interface IRequest {
    /** Optional code/name/category search. */
    search?: null | string;
    /** Include inactive units. */
    includeInactive?: null | boolean;
  }
}
