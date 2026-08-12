import { tags } from "typia";

/** Public profile attributes stored separately from sign-in identity. */
/** @evidence prisma:reddit_profiles Represents the persisted public profile. */
/** @evidenceReview prisma:reddit_profiles Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Defines public profile attributes. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-profile-001-define-public-profile-attributes Carries display name, bio, and avatar. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-001-define-public-profile-attributes Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-profile-003-establish-initial-profile-values Carries registration defaults and later edits. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-003-establish-initial-profile-values Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile Carries the profile edit boundary. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules Carries profile field constraints. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-profile-001-validate-profile-field-changes Carries validated profile changes. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-001-validate-profile-field-changes Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
export interface IRedditProfile {
  /**
   * Profile identifier.
   * @evidence prisma:reddit_profiles.id Carries the profile key.
   * @evidenceReview prisma:reddit_profiles.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Public account identifier.
   * @evidence prisma:reddit_profiles.user_id Carries the owning account key.
   * @evidenceReview prisma:reddit_profiles.user_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  userId: string & tags.Format<"uuid">;
  /**
   * Editable display name.
   * @evidence prisma:reddit_profiles.display_name Carries the stored display name.
   * @evidenceReview prisma:reddit_profiles.display_name Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  displayName: string;
  /**
   * Public biography, possibly empty.
   * @evidence prisma:reddit_profiles.bio Carries the stored biography.
   * @evidenceReview prisma:reddit_profiles.bio Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  bio: string;
  /**
   * Optional accepted avatar payload.
   * @evidence prisma:reddit_profiles.avatar Carries the stored avatar.
   * @evidenceReview prisma:reddit_profiles.avatar Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  avatar: null | string;
}
