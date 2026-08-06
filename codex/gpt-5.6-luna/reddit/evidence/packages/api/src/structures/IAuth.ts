import type { tags } from "typia";

/** Authentication lifecycle request and response contracts. */
 /**
  * @evidence prisma:users Represents the persisted users model.
  * @evidence prisma:sessions Represents authenticated session state.
  * @evidence prisma:recovery_proofs Represents one-time recovery state.
  */
/**
 * The IAuth DTO boundary carries the request and response fields used by its owning operations; runtime behavior is proved there and in live tests.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-001-register-a-user-account The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-002-refuse-conflicting-registration The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-003-log-in-with-credentials The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-004-refuse-ineligible-login The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-001-maintain-concurrent-sessions The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-002-continue-an-authenticated-session The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-003-log-out-the-current-session The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-004-revoke-all-active-sessions The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-001-change-the-current-password The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-003-delete-a-user-account The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-004-apply-permanent-deleted-account-status The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-001-bootstrap-community-owner-and-subscriber The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-002-owner-appointment-of-moderators The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-003-moderator-appointment-of-peers The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-004-owner-removal-of-moderators The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-005-protect-owner-and-moderator-assignments The IAuth contract carries the data shape used by this requirement; behavior is owned by the operation.
 */
 export interface IAuth {
}

export namespace IAuth {
  /** Creates an account and starts a session. */
 /**
  * @evidence prisma:users Represents the persisted users model.
  */
   export interface IJoin {
 /**
  * @evidence prisma:users.email Carries or derives the persisted value used by this property.
  */
 /** @evidence prisma:users.email_normalized Carries the persisted users.email_normalized value or its security-relevant lifecycle.

  */
 /** @evidence prisma:users.username_normalized Carries the persisted users.username_normalized value or its security-relevant lifecycle.
  */
 /** @evidence prisma:users.password_hash Carries the persisted users.password_hash value or its security-relevant lifecycle.
  */
 /** @evidence prisma:users.deleted_at Carries the persisted users.deleted_at value or its security-relevant lifecycle.
  */
 /** @evidence prisma:users.created_at Carries the persisted users.created_at value or its security-relevant lifecycle.

  */
 /** @evidence prisma:sessions.id Carries the persisted sessions.id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:sessions.user_id Carries the persisted sessions.user_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:sessions.created_at Carries the persisted sessions.created_at value or its security-relevant lifecycle.
  */
 /** @evidence prisma:sessions.expires_at Carries the persisted sessions.expires_at value or its security-relevant lifecycle.
  */
 /** @evidence prisma:sessions.revoked_at Carries the persisted sessions.revoked_at value or its security-relevant lifecycle.
  */
 /** @evidence prisma:recovery_proofs.id Carries the persisted recovery_proofs.id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:recovery_proofs.user_id Carries the persisted recovery_proofs.user_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:recovery_proofs.created_at Carries the persisted recovery_proofs.created_at value or its security-relevant lifecycle.
  */
 /** @evidence prisma:recovery_proofs.expires_at Carries the persisted recovery_proofs.expires_at value or its security-relevant lifecycle.
  */
 /** @evidence prisma:recovery_proofs.used_at Carries the persisted recovery_proofs.used_at value or its security-relevant lifecycle.
  */
      email: string & tags.Format<"email">;
 /**
  * @evidence prisma:users.id Carries or derives the persisted value used by this property.
  */
     password: string & tags.MinLength<8>;
 /**
  * @evidence prisma:users.username Carries or derives the persisted value used by this property.
  */
     username: string & tags.MinLength<3> & tags.MaxLength<30>;

  }
  /** Starts a session for an existing account. */
 /**
  * @evidence prisma:users Represents the persisted users model.
  */
   export interface ILogin {
    email: string & tags.Format<"email">;
 /**
  * @evidence prisma:users.id Carries or derives the persisted value used by this property.
  */
     password: string & tags.MinLength<1>;
  }
  /** Continues one existing session. */
 /**
  * @evidence prisma:users Represents the persisted users model.
  */
   export interface IRefresh {
 /**
  * @evidence prisma:sessions.refresh_token_hash Carries or derives the persisted value used by this property.
  */
     refreshToken: string & tags.MinLength<1>;
  }

  /** Replaces the current password. */
 /**
  * @evidence prisma:users Represents the persisted users model.
  */
   export interface IChangePassword {
 /**
  * @evidence prisma:users.id Carries or derives the persisted value used by this property.

  */
     currentPassword: string & tags.MinLength<1>;
 /**
  * @evidence prisma:users.id Carries or derives the persisted value used by this property.
  */
     newPassword: string & tags.MinLength<8>;
  }
  /** Requests one-time recovery proof by email. */
 /**
  * @evidence prisma:users Represents the persisted users model.
  */
   export interface IRecoveryRequest {
    email: string & tags.Format<"email">;
  }
  /** Completes recovery with the latest proof. */
 /**
  * @evidence prisma:users Represents the persisted users model.
  */
   export interface IRecoveryComplete {
    email: string & tags.Format<"email">;
 /**
  * @evidence prisma:recovery_proofs.token_hash Carries or derives the persisted value used by this property.
  */
     proof: string & tags.MinLength<1>;
    newPassword: string & tags.MinLength<8>;
  }
  /** Confirms permanent account deletion. */
 /**
  * @evidence prisma:users Represents the persisted users model.
  */

   export interface IDelete {
    password: string & tags.MinLength<1>;
  }
  /** Authenticated identity and issued bearer material. */
 /**
  * @evidence prisma:users Represents the persisted users model.
  */
   export interface IAuthorized {
 /**
  * @evidence prisma:users.id Carries or derives the persisted value used by this property.
  */
     id: string & tags.Format<"uuid">;
 /**
  * @evidence prisma:users.username Carries or derives the persisted value used by this property.
  */
     username: string;
 /**
  * @evidence prisma:sessions.refresh_token_hash Carries or derives the persisted value used by this property.
  */
     token: {
      access: string;
      refresh: string;
    };

  }
}









