import type { tags } from "typia";

/**
 * Authentication lifecycle contracts for the single credentialed Todo actor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Represents authentication contracts.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Represents session contracts.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Represents account management contracts.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Represents owner-scoped authority.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Represents credential rules.
 * @evidence prisma:todo_accounts Represents account-backed credentials.
 * @evidence prisma:todo_sessions Represents issued session state.
 */
export namespace IAuth {
  /**
   * Creates an account, profile, empty Todo collection, and first session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Creates account input.
   */
  export interface IJoin {
    /**
     * Canonicalized email identity.
     * @evidence prisma:todo_accounts.email Carries account identity.
     */
    email: string & tags.Format<"email">;
    /** Plaintext password accepted only at the transport boundary. */
    password: string & tags.MinLength<8> & tags.MaxLength<128>;
    /** Initial private display name. */
    displayName: string & tags.MinLength<1> & tags.MaxLength<100>;
  }

  /** Login input. */
  export interface ILogin {
    /**
     * Email identity.
     * @evidence prisma:todo_accounts.email Carries account identity.
     */
    email: string & tags.Format<"email">;
    /** Plaintext password. */
    password: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Refresh input. */
  export interface IRefresh {
    /** Previously issued refresh proof. */
    refreshToken: string & tags.MinLength<1>;
  }

  /** Password replacement input. */
  export interface IChangePassword {
    /** Current password proving authority. */
    currentPassword: string & tags.MinLength<1>;
    /** New password. */
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Email-proven forgotten-password replacement input. */
  export interface IRecover {
    /**
     * Registered email identity.
     * @evidence prisma:todo_accounts.email Carries account identity.
     */
    email: string & tags.Format<"email">;
    /** Replacement password. */
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Password confirmation for terminal account deletion. */
  export interface IDeleteAccount {
    /** Current password proving authority. */
    currentPassword: string & tags.MinLength<1>;
  }

  /** Issued session material. */
  export interface IAuthorized {
    /** Tokens retained by the client connection. */
    token: { access: string; refresh: string };
    /** Access-token expiry instant. */
    accessTokenExpiresAt: string & tags.Format<"date-time">;
    /**
     * Refresh-token expiry instant.
     * @evidence prisma:todo_sessions.expires_at Carries session expiry.
     */
    refreshTokenExpiresAt: string & tags.Format<"date-time">;
  }
}
