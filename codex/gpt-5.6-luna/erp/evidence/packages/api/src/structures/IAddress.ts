import type { tags } from "typia";

/** Reusable organization-scoped postal address. */
/**
 * @evidence prisma:addresses Exposes the persisted addresses record.
 */
export interface IAddress {
  /** Address UUID. */
  /** @evidence prisma:addresses.id Carries the persisted id value. */ id: string & tags.Format<"uuid">;
  /** Display label. */
  /** @evidence prisma:addresses.label Carries the persisted label value. */ label: string;
  /** First line. */
  /** @evidence prisma:addresses.line1 Carries the persisted line1 value. */ line1: string;
  /** Optional second line. */
  /** @evidence prisma:addresses.line2 Carries the persisted line2 value. */ line2: null | string;
  /** City or locality. */
  /** @evidence prisma:addresses.city Carries the persisted city value. */ city: string;
  /** Region or province. */
  /** @evidence prisma:addresses.region Carries the persisted region value. */ region: null | string;
  /** Postal code. */
  /** @evidence prisma:addresses.postal_code Carries the persisted postalCode value. */
  postalCode: null | string;
  /** ISO country code. */
  /** @evidence prisma:addresses.country_code Carries the persisted countryCode value. */
  countryCode: string;
  /** Whether selectable for new relationships. */
  /** @evidence prisma:addresses.active Carries the persisted active value. */ active: boolean;
  /** Creation instant. */
  /** @evidence prisma:addresses.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** Last revision instant. */
  /** @evidence prisma:addresses.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IAddress {
  /** Address creation input. */
  export interface ICreate {
    /** Display label. */
    label: string & tags.MinLength<1>;
    /** First line. */
    line1: string & tags.MinLength<1>;
    /** Optional second line. */
    line2?: null | string;
    /** City or locality. */
    city: string & tags.MinLength<1>;
    /** Region or province. */
    region?: null | string;
    /** Postal code. */
    postalCode?: null | string;
    /** ISO country code. */
    countryCode: string & tags.MinLength<2> & tags.MaxLength<2>;
  }
  /** Address update input. */
  export interface IUpdate extends Partial<ICreate> {}
  /** Address list request. */
  export interface IRequest {
    /** Optional name search. */
    search?: null | string;
    /** Include inactive addresses. */
    includeInactive?: null | boolean;
  }
  /** Address activation transition. */
  export interface IStatus {
    /** New active state. */
    active: boolean;
  }
}
