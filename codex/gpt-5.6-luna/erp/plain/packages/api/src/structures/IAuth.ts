import type { tags } from "typia";

/** Global user profile and authentication contracts. */
export interface IUser {
  /** User identifier. */
  id: string & tags.Format<"uuid">;
  /** Login email. */
  email: string & tags.Format<"email">;
  /** Display name. */
  displayName: string;
  /** Optional avatar reference. */
  avatar: null | string;
  /** Optional phone. */
  phone: null | string;
  /** Locale. */
  locale: string;
  /** Timezone. */
  timezone: string;
  /** Account status. */
  status: "active" | "deactivated";
}

export namespace IUser {
  /** Credentials for an existing global user. */
  export interface ILogin {
    /** Login email. */
    email: string & tags.Format<"email">;
    /** Plaintext password, used only at the input boundary. */
    password: string & tags.MinLength<8>;
  }
  /** Credentials and invitation proof used to accept an invitation. */
  export interface IAcceptInvitation {
    /** Invitation proof. */
    token: string & tags.MinLength<16>;
    /** Email bound to the invitation. */
    email: string & tags.Format<"email">;
    /** New password for a first-time identity. */
    password: string & tags.MinLength<8>;
    /** Display name for a first-time identity. */
    displayName: string & tags.MinLength<1>;
  }
  /** Returned bearer session. */
  export interface IAuthorized {
    /** User profile. */
    user: IUser;
    /** Opaque bearer access token. */
    accessToken: string;
    /** Access-token expiry instant. */
    accessExpiresAt: string & tags.Format<"date-time">;
    /** Opaque rotating credential used to obtain a replacement access token. */
    refreshToken: string;
    /** Active memberships available for context selection. */
    memberships: IMembership.ISummary[];
  }
  /** Rotating refresh credential presented without an access session. */
  export interface IRefresh {
    /** Previously issued refresh token. */
    refreshToken: string & tags.MinLength<16>;
  }
  /** Profile update fields. */
  export interface IUpdate {
    /** Display name. */
    displayName?: null | string;
    /** Avatar reference. */
    avatar?: null | string;
    /** Phone. */
    phone?: null | string;
    /** Locale. */
    locale?: null | string;
    /** Timezone. */
    timezone?: null | string;
  }
  /** Current and replacement credentials for a signed-in password change. */
  export interface IChangePassword {
    /** Current password proof. */
    currentPassword: string & tags.MinLength<8>;
    /** Replacement password. */
    newPassword: string & tags.MinLength<8>;
  }
  /** Email supplied to request account recovery. */
  export interface IRecoveryRequest {
    /** Login email; the response does not disclose account existence. */
    email: string & tags.Format<"email">;
  }
  /** Email-bound recovery proof and replacement credentials. */
  export interface IRecoveryComplete {
    /** Single-use recovery proof delivered out of band. */
    token: string & tags.MinLength<16>;
    /** Login email bound to the proof. */
    email: string & tags.Format<"email">;
    /** Replacement password. */
    newPassword: string & tags.MinLength<8>;
  }
}

/** Organization membership. */
export interface IMembership {
  /** Membership identifier. */
  id: string & tags.Format<"uuid">;
  /** Organization identifier. */
  organizationId: string & tags.Format<"uuid">;
  /** Membership state. */
  status: "invited" | "active" | "suspended" | "revoked";
  /** Effective role names. */
  roles: string[];
}
export namespace IMembership {
  /** Compact membership used during context selection. */
  export interface ISummary extends IMembership {}
}

/** Owner invitation. */
export interface IInvitation {
  /** Invitation identifier. */
  id: string & tags.Format<"uuid">;
  /** Intended recipient. */
  email: string & tags.Format<"email">;
  /** Initial role. */
  role: string;
  /** Invitation state. */
  status: "pending" | "accepted" | "revoked";
  /** Creation instant. */
  createdAt: string & tags.Format<"date-time">;
  /** Expiry instant. */
  expiresAt: string & tags.Format<"date-time">;
}
