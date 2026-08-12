import type { tags } from "typia";

/**
 * The private account and authentication lifecycle owned by one user.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Represents the account identity used by registration and login.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Carries the registration inputs and issued session result.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Carries login credentials and its issued session result.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Represents the session continuation and logout contract.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-1-continue-an-authenticated-session Carries refresh material for the same account session.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-1-continue-an-authenticated-session Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-2-log-out-the-current-session Represents the current session identity.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-2-log-out-the-current-session Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Represents the account identity whose sessions are ended.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Carries account-security lifecycle inputs.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-1-change-the-account-password Carries the credential replacement input.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-1-change-the-account-password Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Carries the non-disclosing recovery and reset inputs.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-3-permanently-delete-the-account Carries the password confirmation input.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-3-permanently-delete-the-account Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Defines the caller identity for the private boundary.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Represents authenticated session continuity.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Represents the one account ownership boundary.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Carries the credential inputs subject to the shared rules.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Represents the canonical email identity.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Constrains every password input.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-3-conceal-login-credential-failure Represents generic login credentials.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-3-conceal-login-credential-failure Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Carries both replacement journeys.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence prisma:todo_users Represents the persisted account model.
 * @evidenceReview prisma:todo_users Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
 * @evidence prisma:todo_sessions Represents issued session material.
 * @evidenceReview prisma:todo_sessions Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
 */
export interface ITodoUser {
  /**
   * Account UUID returned only as the identity of the authenticated caller.
   * @evidence prisma:todo_users.id Carries the account primary key.
   * @evidenceReview prisma:todo_users.id Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Registration and login result carrying the active session credentials.
   * @evidence prisma:todo_sessions.id Derives the issued session identity.
   * @evidenceReview prisma:todo_sessions.id Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  token: ITodoUser.IAuthorizedToken;
}

export namespace ITodoUser {
  /** Email, password, and initial private display name used at registration. */
  export interface IJoin {
    /**
     * Canonicalized email identity.
     * @evidence prisma:todo_users.email Carries the login identity.
     * @evidenceReview prisma:todo_users.email Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    email: string & tags.MinLength<1>;
    /**
     * Password evaluated exactly as supplied, from 8 through 128 characters.
     * @evidence prisma:todo_users.password_hash Supplies the source for the stored verifier.
     * @evidenceReview prisma:todo_users.password_hash Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    password: string & tags.MinLength<8> & tags.MaxLength<128>;
    /**
     * Initial private profile display name.
     * @evidence prisma:todo_profiles.display_name Supplies the profile value created with the account.
     * @evidenceReview prisma:todo_profiles.display_name Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    displayName: string & tags.MinLength<1> & tags.MaxLength<100>;
  }

  /** Existing email credentials used to create a new independent session. */
  export interface ILogin {
    /**
     * Canonicalized email identity.
     * @evidence prisma:todo_users.email Carries the login identity.
     * @evidenceReview prisma:todo_users.email Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    email: string & tags.MinLength<1>;
    /**
     * Password evaluated exactly as supplied.
     * @evidence prisma:todo_users.password_hash Supplies the verifier comparison input.
     * @evidenceReview prisma:todo_users.password_hash Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    password: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Refresh proof used to continue one still-valid authenticated session. */
  export interface IRefresh {
    /**
     * Opaque refresh token issued by registration or login.
     * @evidence prisma:todo_sessions.refresh_token_hash Represents the persisted refresh proof.
     * @evidenceReview prisma:todo_sessions.refresh_token_hash Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    refreshToken: string & tags.MinLength<1>;
  }

  /** Current-password and replacement-password pair. */
  export interface IChangePassword {
    /**
     * Existing password proving authority for this account.
     * @evidence prisma:todo_users.password_hash Selects the verifier to check.
     * @evidenceReview prisma:todo_users.password_hash Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    currentPassword: string & tags.MinLength<1>;
    /**
     * New password, distinct from the current password.
     * @evidence prisma:todo_users.password_hash Replaces the stored verifier.
     * @evidenceReview prisma:todo_users.password_hash Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Current password required for terminal account deletion. */
  export interface IDelete {
    /**
     * Existing password confirming the irreversible action.
     * @evidence prisma:todo_users.password_hash Confirms account deletion authority.
     * @evidenceReview prisma:todo_users.password_hash Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    password: string & tags.MinLength<1>;
  }

  /** Non-disclosing request that starts email-identity recovery. */
  export interface IRecover {
    /**
     * Email address to which the recovery proof is delivered when registered.
     * @evidence prisma:todo_users.email Selects the registered delivery recipient.
     * @evidenceReview prisma:todo_users.email Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    email: string & tags.MinLength<1>;
  }

  /**
   * One-time proof and accepted replacement password for recovery.
   * @evidence prisma:todo_recovery_tokens Represents the one-time delivery record consumed by reset.
   * @evidenceReview prisma:todo_recovery_tokens Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  export interface IReset {
    /**
     * Proof read from the email delivery boundary.
     * @evidence prisma:todo_recovery_tokens.token_hash Represents the consumed proof record.
     * @evidenceReview prisma:todo_recovery_tokens.token_hash Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    token: string & tags.MinLength<1>;
    /**
     * Replacement password accepted for future login.
     * @evidence prisma:todo_users.password_hash Replaces the forgotten verifier.
     * @evidenceReview prisma:todo_users.password_hash Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Authorization material issued by a successful account lifecycle call. */
  export interface IAuthorizedToken {
    /**
     * Short-lived bearer access token retained in Authorization.
     * @evidence prisma:todo_sessions.id Derives a signed bearer for the session.
     * @evidenceReview prisma:todo_sessions.id Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    access: string & tags.MinLength<1>;
    /**
     * Longer-lived proof used by the refresh operation.
     * @evidence prisma:todo_sessions.refresh_token_hash Returns the issued refresh proof.
     * @evidenceReview prisma:todo_sessions.refresh_token_hash Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    refresh: string & tags.MinLength<1>;
    /**
     * Access-token expiration instant in ISO form.
     * @evidence prisma:todo_sessions.expires_at Carries the session expiration boundary.
     * @evidenceReview prisma:todo_sessions.expires_at Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
     */
    expiredAt: string & tags.Format<"date-time">;
  }

  /** Registration, login, or refresh response. */
  export interface IAuthorized extends ITodoUser {}
}
