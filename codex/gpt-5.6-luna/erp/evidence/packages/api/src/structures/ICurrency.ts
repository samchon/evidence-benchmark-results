import type { tags } from "typia";

/** Organization-supported currency. */
/**
 * @evidence prisma:currencies Exposes the persisted currencies record.
 */
export interface ICurrency {
  /** Currency UUID. */
  /** @evidence prisma:currencies.id Carries the persisted id value. */ id: string & tags.Format<"uuid">;
  /** ISO code. */
  /** @evidence prisma:currencies.code Carries the persisted code value. */ code: string;
  /** Display name. */
  /** @evidence prisma:currencies.name Carries the persisted name value. */ name: string;
  /** Fractional precision. */
  /** @evidence prisma:currencies.precision Carries the persisted fractional precision. */ precision: number & tags.Type<"uint32">;
  /** Whether selectable for new transactions. */
  /** @evidence prisma:currencies.active Carries the persisted active flag. */ active: boolean;
  /** Creation instant. */
  /** @evidence prisma:currencies.created_at Carries the persisted creation instant. */ createdAt: string & tags.Format<"date-time">;
  /** Last revision instant. */
  /** @evidence prisma:currencies.updated_at Carries the persisted update instant. */ updatedAt: string & tags.Format<"date-time">;
}
export namespace ICurrency {
  /** Currency creation input. */
  export interface ICreate {
    /** ISO code. */
    code: string & tags.MinLength<3> & tags.MaxLength<3>;
    /** Display name. */
    name: string & tags.MinLength<1>;
    /** Fractional precision. */
    precision: number & tags.Type<"uint32"> & tags.Maximum<9>;
  }
  /** Currency update input. */
  export interface IUpdate extends Partial<Omit<ICreate, "code">> {}
  /** Currency list request. */
  export interface IRequest {
    /** Optional code or name search. */
    search?: null | string;
    /** Include inactive currencies. */
    includeInactive?: null | boolean;
  }
}
