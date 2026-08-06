import type { tags } from "typia";

/** Organization-scoped contact person. */
/**
 * @evidence prisma:contacts Exposes the persisted contacts record.
 */
export interface IContact {
  /** Contact UUID. */
  /** @evidence prisma:contacts.id Carries the persisted id value. */ id: string & tags.Format<"uuid">;
  /** Person name. */
  /** @evidence prisma:contacts.name Carries the persisted name value. */ name: string;
  /** Email, when supplied. */
  /** @evidence prisma:contacts.email Carries the persisted email value. */ email: null | string;
  /** Phone, when supplied. */
  /** @evidence prisma:contacts.phone Carries the persisted phone value. */ phone: null | string;
  /** Whether selectable for new relationships. */
  /** @evidence prisma:contacts.active Carries the persisted active value. */ active: boolean;
  /** Creation instant. */
  /** @evidence prisma:contacts.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** Last revision instant. */
  /** @evidence prisma:contacts.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IContact {
  /** Contact creation input. */
  export interface ICreate {
    /** Person name. */
    name: string & tags.MinLength<1>;
    /** Email, when supplied. */
    email?: null | (string & tags.Format<"email">);
    /** Phone, when supplied. */
    phone?: null | string;
  }
  /** Contact update input. */
  export interface IUpdate extends Partial<ICreate> {}
  /** Contact list request. */
  export interface IRequest {
    /** Optional name search. */
    search?: null | string;
    /** Optional email search. */
    email?: null | string;
    /** Include inactive contacts. */
    includeInactive?: null | boolean;
  }

  /** Contact assignment to one external party. */
  export interface IAssign {
    partyType: "vendor" | "customer";
    partyId: string & tags.Format<"uuid">;
    primary?: boolean;
  }

  /** Persisted contact-party relationship. */
  export interface IAssignment {
    id: string & tags.Format<"uuid">;
    contactId: string & tags.Format<"uuid">;
    partyType: "vendor" | "customer";
    partyId: string & tags.Format<"uuid">;
    primary: boolean;
    createdAt: string & tags.Format<"date-time">;
  }
}
