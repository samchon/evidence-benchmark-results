import type { tags } from "typia";

/** Private profile shown only to its authenticated owner. */
export interface IUser {
  /** Profile identifier. */
  id: string & tags.Format<"uuid">;
  /** Current display name. */
  displayName: string & tags.MinLength<1> & tags.MaxLength<100>;
}

/** Successful acknowledgement for stateful commands without a resource body. */
export interface IOperationResult {
  /** Always true when the operation completed. */
  success: true;
}

export namespace IUser {
  /** Profile edit input. */
  export interface IUpdateProfile {
    /** Replacement display name. */
    displayName: string & tags.MinLength<1>;
  }
  /** Registration input. */
  export interface IJoin {
    /** Canonicalized by the server after validation. */
    email: string & tags.MinLength<1>;
    /** Eight through 128 characters; not trimmed. */
    password: string & tags.MinLength<8> & tags.MaxLength<128>;
    /** Trimmed by the server and bounded to one through 100 characters. */
    displayName: string & tags.MinLength<1>;
  }

  /** Login input. */
  export interface ILogin {
    /** Account email. */
    email: string & tags.MinLength<1>;
    /** Account password. */
    password: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Refresh input for a still-valid session. */
  export interface IRefresh {
    /** Previously issued refresh token. */
    refreshToken: string & tags.MinLength<1>;
  }

  /** Password replacement input. */
  export interface IChangePassword {
    /** Current password proving authority. */
    currentPassword: string & tags.MinLength<1>;
    /** New eight-through-128-character password. */
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Starts a non-disclosing email recovery journey. */
  export interface IRecoveryRequest {
    /** Email whose ownership should receive a proof. */
    email: string & tags.MinLength<1>;
  }

  /** Consumes the proof delivered to the registered email. */
  export interface IRecoveryConfirm {
    /** Registered email identity. */
    email: string & tags.MinLength<1>;
    /** One-time proof from the recorded email effect. */
    proof: string & tags.MinLength<1>;
    /** Replacement password. */
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Password confirmation for terminal account deletion. */
  export interface IDeleteAccount {
    /** Current password proving authority. */
    currentPassword: string & tags.MinLength<1>;
  }

  /** Authentication material returned by join, login, and refresh. */
  export interface IAuthorized {
    /** Short-lived bearer token. */
    accessToken: string & tags.MinLength<1>;
    /** Session continuation token. */
    refreshToken: string & tags.MinLength<1>;
    /** Access-token expiry instant. */
    accessExpiresAt: string & tags.Format<"date-time">;
    /** Authenticated private profile. */
    user: IUser;
    /** Tokens also issued through the standard Nestia authorization header hook. */
    token: {
      /** Short-lived access bearer token. */
      access: string & tags.MinLength<1>;
      /** Session continuation token. */
      refresh: string & tags.MinLength<1>;
    };
  }
}
