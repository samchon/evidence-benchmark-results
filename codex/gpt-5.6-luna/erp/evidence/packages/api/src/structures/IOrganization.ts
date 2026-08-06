import type { tags } from "typia";

/** Organization tenant and its configurable defaults. */
/**
 * @evidence prisma:organizations Exposes the persisted organizations record.
 */
export interface IOrganization {
  /** Organization UUID. */
  /** @evidence prisma:organizations.id Carries the persisted id value. */ id: string & tags.Format<"uuid">;
  /** Display name. */
  /** @evidence prisma:organizations.name Carries the persisted display name. */ name: string;
  /** Stable organization code. */
  /** @evidence prisma:organizations.code Carries the persisted stable code. */ code: string;
  /** Organization lifecycle status. */
  /** @evidence prisma:organizations.status Carries the persisted lifecycle status. */ status: string;
  /** ISO base currency code. */
  /** @evidence prisma:organizations.base_currency Carries the persisted baseCurrency value. */
  baseCurrency: string;
  /** IANA timezone. */
  /** @evidence prisma:organizations.timezone Carries the persisted timezone. */ timezone: string;
  /** Fiscal year start month. */
  /** @evidence prisma:organizations.fiscal_start_month Carries the persisted fiscalStartMonth value. */
  fiscalStartMonth: number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<12>;
  /** Default tax jurisdiction code, when configured. */
  /** @evidence prisma:organizations.default_tax_jurisdiction Carries the persisted defaultTaxJurisdiction value. */
  defaultTaxJurisdiction: null | string;
  /** Default payment term code, when configured. */
  /** @evidence prisma:organizations.default_payment_term Carries the persisted defaultPaymentTerm value. */
  defaultPaymentTerm: null | string;
  /** Negative-stock policy identifier. */
  /** @evidence prisma:organizations.negative_stock_policy Carries the persisted negativeStockPolicy value. */
  negativeStockPolicy: string;
  /** Approval threshold in base currency. */
  /** @evidence prisma:organizations.approval_threshold Carries the persisted approvalThreshold value. */
  approvalThreshold: number;
  /** Numbering prefix used for generated documents. */
  /** @evidence prisma:organizations.numbering_prefix Carries the persisted numberingPrefix value. */
  numberingPrefix: string;
  /** Whether the organization accepts new work. */
  /** @evidence prisma:organizations.active Carries the persisted active flag. */ active: boolean;
  /** Creation instant. */
  /** @evidence prisma:organizations.created_at Carries the persisted creation instant. */ createdAt: string & tags.Format<"date-time">;
  /** Last configuration update instant. */
  /** @evidence prisma:organizations.updated_at Carries the persisted update instant. */ updatedAt: string & tags.Format<"date-time">;
}

export namespace IOrganization {
  /** Deletion eligibility and retained blockers for an organization. */
  export interface IDeleteCheck {
    eligible: boolean;
    blockers: string[];
  }
  /** Organization creation fields; the caller becomes its first Owner. */
  export interface ICreate {
    /** Display name. */
    name: string & tags.MinLength<1> & tags.MaxLength<255>;
    /** ISO base currency code. */
    baseCurrency: string & tags.MinLength<3> & tags.MaxLength<3>;
    /** IANA timezone. */
    timezone: string & tags.MinLength<1>;
    /** Fiscal year start month. */
    fiscalStartMonth: number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<12>;
    /** Stable organization code. */
    code: string & tags.MinLength<2> & tags.MaxLength<64>;
    /** First Owner login email. */
    ownerEmail: string & tags.Format<"email">;
    /** First Owner password. */
    ownerPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
    /** First Owner display name. */
    ownerDisplayName: string & tags.MinLength<1> & tags.MaxLength<255>;
  }

  /** Mutable organization configuration fields. */
  export interface IUpdate {
    /** Display name. */
    name?: null | (string & tags.MinLength<1> & tags.MaxLength<255>);
    /** IANA timezone. */
    timezone?: null | string;
    /** Fiscal year start month. */
    fiscalStartMonth?: null | (number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<12>);
    /** Default tax jurisdiction code. */
    defaultTaxJurisdiction?: null | string;
    /** Default payment term code. */
    defaultPaymentTerm?: null | string;
    /** Negative-stock policy identifier. */
    negativeStockPolicy?: null | string;
    /** Approval threshold in base currency. */
    approvalThreshold?: null | number;
    /** Numbering prefix. */
    numberingPrefix?: null | string;
  }

  /** Pagination and optional search for organization membership catalogs. */
  export interface IRequest {
    /** One-indexed page. */
    page?: null | (number & tags.Type<"uint32"> & tags.Minimum<1>);
    /** Page size; zero means all. */
    limit?: null | (number & tags.Type<"uint32">);
    /** Case-insensitive name search. */
    search?: null | string;
  }
}
