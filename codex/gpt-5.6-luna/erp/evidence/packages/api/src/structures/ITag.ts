import type { tags } from "typia";

/** Reusable organization classification tag. */
/**
 * @evidence prisma:tags Exposes the persisted tags record.
 */
export interface ITag {
  /** Tag UUID. */
  /** @evidence prisma:tags.id Carries the persisted id value. */ id: string & tags.Format<"uuid">;
  /** Label. */
  /** @evidence prisma:tags.label Carries the persisted label value. */ label: string;
  /** Description, when supplied. */
  /** @evidence prisma:tags.description Carries the persisted description value. */ description: null | string;
  /** Whether selectable for new assignments. */
  /** @evidence prisma:tags.active Carries the persisted active value. */ active: boolean;
  /** Creation instant. */
  /** @evidence prisma:tags.created_at Carries the persisted created_at value. */ createdAt: string & tags.Format<"date-time">;
  /** Last revision instant. */
  /** @evidence prisma:tags.updated_at Carries the persisted updated_at value. */ updatedAt: string & tags.Format<"date-time">;
}
export namespace ITag {
  /** Tag creation input. */
  export interface ICreate {
    /** Label. */
    label: string & tags.MinLength<1>;
    /** Optional description. */
    description?: null | string;
  }
  /** Tag update input. */
  export interface IUpdate extends Partial<ICreate> {}
  /** Tag list request. */
  export interface IRequest {
    /** Optional label search. */
    search?: null | string;
    /** Include inactive tags. */
    includeInactive?: null | boolean;
  }
}
