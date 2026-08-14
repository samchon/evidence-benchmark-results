import type { tags } from "typia";

/** Tenant organization configuration. */
export interface IOrganization {
  /** Organization identifier. */
  id: string & tags.Format<"uuid">;
  /** Organization name. */
  name: string;
  /** Base currency code. */
  baseCurrency: string;
  /** IANA timezone. */
  timezone: string;
  /** Fiscal year start month. */
  fiscalStartMonth: number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<12>;
  /** Whether negative inventory is allowed. */
  negativeStockAllowed: boolean;
  /** Approval threshold. */
  approvalThreshold: number & tags.Minimum<0>;
  /** Organization lifecycle. */
  status: "active" | "deleted";
  /** Creation instant. */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IOrganization {
  /** Deletion eligibility and all blocking retained records. */
  export interface IDeletionCheck { organizationId: string & tags.Format<"uuid">; eligible: boolean; blockers: string[]; }
  /** Organization creation also establishes the first Owner. */
  export interface ICreate {
    /** Organization name. */
    name: string & tags.MinLength<1>;
    /** Owner email. */
    email: string & tags.Format<"email">;
    /** Owner password. */
    password: string & tags.MinLength<8>;
    /** Owner display name. */
    displayName: string & tags.MinLength<1>;
    /** Base currency code. */
    baseCurrency: string & tags.MinLength<3> & tags.MaxLength<3>;
    /** IANA timezone. */
    timezone: string;
    /** Fiscal year start month. */
    fiscalStartMonth: number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<12>;
  }
  /** Owner-editable organization settings. */
  export interface IUpdate {
    /** Organization name. */
    name?: null | string;
    /** Base currency code. */
    baseCurrency?: null | string;
    /** IANA timezone. */
    timezone?: null | string;
    /** Fiscal year start month. */
    fiscalStartMonth?: null | (number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<12>);
    /** Negative stock policy. */
    negativeStockAllowed?: null | boolean;
    /** Approval threshold. */
    approvalThreshold?: null | (number & tags.Minimum<0>);
  }
  /** Authenticated invitation request. */
  export interface IInvite {
    /** Recipient email. */
    email: string & tags.Format<"email">;
    /** Initial role. */
    role?: null | string;
  }
}
