import { tags } from "typia";
import type { IPage } from "../typings/IPage";
import type { IRedditComment } from "./IRedditComment";
import type { IRedditPost } from "./IRedditPost";

/** Public account identity and available authored content. */
/** @evidence prisma:reddit_users Represents the persisted public account identity. */
/** @evidenceReview prisma:reddit_users Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. */
/** @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login Defines the public and private identity contract. */
/** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle Carries the authenticated account identity used by session operations. */
/** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle Carries account-management inputs and public identity. */
/** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Represents the account side of scoped roles. */
/** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Represents public profile and authorship output. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Defines profile read and edit payloads. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile Carries the profile edit request. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-profile-002-view-a-users-public-profile Carries the public profile response. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-002-view-a-users-public-profile Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy Excludes private credentials from the public shape. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-karma-karma-model Carries the public karma value. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-karma-karma-model Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-karma-001-define-the-single-signed-karma-total Carries one signed karma total. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-karma-001-define-the-single-signed-karma-total Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-karma-002-define-karma-contribution-mappings Carries the aggregate affected by vote transitions. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-karma-002-define-karma-contribution-mappings Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules Carries validated identity inputs. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-identity-001-enforce-case-insensitive-email-and-username-uniqueness Carries username and email registration fields. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-001-enforce-case-insensitive-email-and-username-uniqueness Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-identity-002-require-complete-registration-credentials Carries all registration credentials and constraints. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-002-require-complete-registration-credentials Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-identity-003-reserve-deleted-account-identifiers Carries the public identity that remains reserved. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-003-reserve-deleted-account-identifiers Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Carries karma in public aggregate responses. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Carries the resulting karma value. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
export interface IRedditUser {
  /**
   * Stable public account identifier.
   * @evidence prisma:reddit_users.id Carries the account primary key.
   * @evidenceReview prisma:reddit_users.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Case-preserving public username.
   * @evidence prisma:reddit_users.username Carries the public username.
   * @evidenceReview prisma:reddit_users.username Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  username: string;
  /**
   * Editable public display name.
   * @evidence prisma:reddit_profiles.display_name Carries the profile display name.
   * @evidenceReview prisma:reddit_profiles.display_name Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  displayName: string;
  /**
   * Editable public biography, possibly empty.
   * @evidence prisma:reddit_profiles.bio Carries the profile biography.
   * @evidenceReview prisma:reddit_profiles.bio Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  bio: string;
  /**
   * Optional accepted avatar payload.
   * @evidence prisma:reddit_profiles.avatar Carries the public avatar.
   * @evidenceReview prisma:reddit_profiles.avatar Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  avatar: null | string;
  /**
   * Signed karma from available authored content.
   * @evidence prisma:reddit_users.karma Carries the signed karma total.
   * @evidenceReview prisma:reddit_users.karma Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  karma: number;
  /** Independently paginated available posts. */
  posts: IPage<IRedditPost.ISummary>;
  /** Independently paginated available comments. */
  comments: IPage<IRedditComment.ISummary>;
}

export namespace IRedditUser {
  /** Compact public identity embedded in content responses. */
  export interface ISummary {
  /**
   * Stable public account identifier.
   * @evidence prisma:reddit_users.id Carries the compact account key.
   * @evidenceReview prisma:reddit_users.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
    id: string & tags.Format<"uuid">;
    /**
     * Case-preserving public username.
     * @evidence prisma:reddit_users.username Carries the compact username.
     * @evidenceReview prisma:reddit_users.username Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    username: string;
    /**
     * Public display name.
     * @evidence prisma:reddit_profiles.display_name Carries the compact display name.
     * @evidenceReview prisma:reddit_profiles.display_name Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    displayName: string;
    /**
     * Optional public avatar payload.
     * @evidence prisma:reddit_profiles.avatar Carries the compact avatar.
     * @evidenceReview prisma:reddit_profiles.avatar Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    avatar: null | string;
  }

  /** Registration input. */
  export interface IJoin {
    /**
     * Private sign-in email.
     * @evidence prisma:reddit_users.email Carries the registration email input.
     * @evidenceReview prisma:reddit_users.email Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    email: string & tags.Format<"email">;
    /**
     * Public username.
     * @evidence prisma:reddit_users.username Carries the registration username input.
     * @evidenceReview prisma:reddit_users.username Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    username: string & tags.MinLength<3> & tags.MaxLength<30> & tags.Pattern<"^[A-Za-z0-9_]+$">;
    /** New password, never returned. */
    password: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Credential login input. */
  export interface ILogin {
    /** Private sign-in email. */
    email: string & tags.Format<"email">;
    /** Candidate password. */
    password: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Session continuation input. */
  export interface IRefresh {
    /** Current refresh token. */
    refreshToken: string & tags.MinLength<1>;
  }

  /** Authentication response containing only issued authorization material. */
  export interface IAuthorized {
    /** Short-lived bearer token. */
    accessToken: string;
    /** Long-lived session continuation token. */
    refreshToken: string;
    /** Public identity of the authenticated account. */
    user: ISummary;
  }

  /** Current-password replacement input. */
  export interface IPasswordUpdate {
    /** Existing password proof. */
    currentPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
    /** Replacement password. */
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Neutral forgotten-password request input. */
  export interface IRecoveryRequest {
    /** Email that may identify an active account. */
    email: string & tags.Format<"email">;
  }

  /** One-time recovery completion input. */
  export interface IRecoveryComplete {
    /** Registered email. */
    email: string & tags.Format<"email">;
    /** Delivered one-time proof. */
    proof: string & tags.MinLength<1>;
    /** Replacement password. */
    newPassword: string & tags.MinLength<8> & tags.MaxLength<128>;
  }

  /** Partial current-profile update. */
  export interface IUpdate {
    /** New visible display name, when supplied. */
    displayName?: null | (string & tags.MinLength<1>);
    /** New biography, including empty string to clear it. */
    bio?: null | string;
    /** New avatar payload or null to remove it. */
    avatar?: null | string;
  }
}
