import type { tags } from "typia";

/** Authentication and session contracts for the global User identity. */
export namespace IAuth {
  /** Headers accepted by protected operations. */
  export interface IHeaders {
    /** Bearer access token issued by login or refresh. */
    authorization: string & tags.MinLength<1>;
  }

  /** Invitation acceptance and first-account credential input. */
  export interface IJoin {
    /** Invitation proof delivered to the recipient. */
    invitationToken: string & tags.MinLength<16>;
    /** Email must match the invitation recipient. */
    email: string & tags.Format<"email">;
    /** New global account password. */
    password: string & tags.MinLength<8> & tags.MaxLength<128>;
    /** Initial global display name. */
    displayName: string & tags.MinLength<1> & tags.MaxLength<255>;
  }

  /** Email-and-password login input. */
  export interface ILogin {
    /** Global login email. */
    email: string & tags.Format<"email">;
    /** Global account password. */
    password: string & tags.MinLength<1>;
  }

  /** Editable global profile fields. */
  export interface IProfileUpdate {
    displayName?: null | (string & tags.MinLength<1> & tags.MaxLength<255>);
    avatar?: null | string;
    phone?: null | string;
    locale?: null | string;
    timezone?: null | string;
  }

  /** Current-password proof and replacement credential. */
  export interface IPasswordChange {
    currentPassword: string & tags.MinLength<1>;
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Email-bound account recovery request. */
  export interface IRecoveryRequest {
    /** Email associated with the global account. */
    email: string & tags.Format<"email">;
  }

  /** Single-use recovery proof and replacement password. */
  export interface IRecoveryComplete {
    /** Raw proof delivered to the requested email address. */
    recoveryToken: string & tags.MinLength<16>;
    /** Replacement global credential. */
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Recovery issuance result. */
  export interface IRecoveryIssued {
    /** Opaque proof returned by the configured delivery adapter. */
    recoveryToken: string & tags.MinLength<16>;
    /** Expiration instant for the proof. */
    expiresAt: string & tags.Format<"date-time">;
  }

  /** Refresh-token input. */
  export interface IRefresh {
    /** Refresh credential issued with the session. */
    refreshToken: string & tags.MinLength<16>;
  }

  /** Issued credentials and the global identity summary. */
  export interface IAuthorized {
    /** Short-lived bearer access token. */
    accessToken: string & tags.MinLength<1>;
    /** Long-lived session continuation token. */
    refreshToken: string & tags.MinLength<1>;
    /** Access-token expiry instant. */
    accessExpiresAt: string & tags.Format<"date-time">;
    /** Refresh-token expiry instant. */
    refreshExpiresAt: string & tags.Format<"date-time">;
  /** Global user represented by the session.
   * @evidence prisma:users Exposes the persisted global user record.
   */
    user: IUser;
    /** Organization memberships available for context selection. */
    memberships: IMembership[];
  }

  /** Current authenticated user payload used by providers. */
  export interface IUser {
    /** Global user UUID. */
    id: string & tags.Format<"uuid">;
    /** Login email. */
    email: string & tags.Format<"email">;
    /** Display name. */
    displayName: string;
    /** Optional avatar reference. */
    avatar: null | string;
    /** Optional phone number. */
    phone: null | string;
    /** Locale preference. */
    locale: string;
    /** Timezone preference. */
    timezone: string;
    /** Account activation state. */
    active: boolean;
  }

  /** Membership summary included with issued credentials. */
  export interface IMembership {
    /** Membership UUID. */
    id: string & tags.Format<"uuid">;
    /** Organization UUID. */
    organizationId: string & tags.Format<"uuid">;
    /** Organization display name. */
    organizationName: string;
    /** Current membership lifecycle state. */
    status: "invited" | "active" | "suspended" | "revoked";
    /** Role keys currently assigned. */
    roles: string[];
  }
}
