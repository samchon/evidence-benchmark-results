import type { tags } from "typia";

/** Organization-scoped payment term. */
/**
 * @evidence prisma:payment_terms Exposes the persisted payment_terms record.
 */
export interface IPaymentTerm {
  /** Payment-term UUID. */
  /** @evidence prisma:payment_terms.id Carries the persisted id value. */ id: string & tags.Format<"uuid">;
  /** Term name. */
  /** @evidence prisma:payment_terms.name Carries the persisted term name. */ name: string;
  /** Due-date convention. */
  /** @evidence prisma:payment_terms.due_date_convention Carries the persisted dueDateConvention value. */
  dueDateConvention: string;
  /** Whether selectable for new documents. */
  /** @evidence prisma:payment_terms.active Carries the persisted active flag. */ active: boolean;
  /** Creation instant. */
  /** @evidence prisma:payment_terms.created_at Carries the persisted creation instant. */ createdAt: string & tags.Format<"date-time">;
  /** Last revision instant. */
  /** @evidence prisma:payment_terms.updated_at Carries the persisted update instant. */ updatedAt: string & tags.Format<"date-time">;
}
export namespace IPaymentTerm {
  /** Payment-term creation input. */
  export interface ICreate {
    /** Term name. */
    name: string & tags.MinLength<1>;
    /** Due-date convention. */
    dueDateConvention: string & tags.MinLength<1>;
  }
  /** Payment-term update input. */
  export interface IUpdate extends Partial<ICreate> {}
  /** Payment-term list request. */
  export interface IRequest {
    /** Optional name search. */
    search?: null | string;
    /** Include inactive terms. */
    includeInactive?: null | boolean;
  }
}
