import type { IPage } from "../typings";
import type { tags } from "typia";
import type { IComment } from "./IComment";
import type { IPost } from "./IPost";

/** Public profile and editable profile fields. */
 /**
  * @evidence prisma:profiles Represents the persisted profiles model.
  */
/**
 * The IProfile DTO boundary carries the request and response fields used by its owning operations; runtime behavior is proved there and in live tests.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model The IProfile contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-001-define-public-profile-attributes The IProfile contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-003-establish-initial-profile-values The IProfile contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations The IProfile contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile The IProfile contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-002-view-a-users-public-profile The IProfile contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules The IProfile contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-001-validate-profile-field-changes The IProfile contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy The IProfile contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-001-keep-credentials-and-email-private The IProfile contract carries the data shape used by this requirement; behavior is owned by the operation.
 */
 export interface IProfile {
 /**
  * @evidence prisma:profiles.id Carries or derives the persisted value used by this property.
  */
 /** @evidence prisma:profiles.user_id Carries the persisted profiles.user_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:profiles.created_at Carries the persisted profiles.created_at value or its security-relevant lifecycle.
  */
    id: string & tags.Format<"uuid">;
 /**
  * @evidence prisma:users.username Carries or derives the persisted value used by this property.
  */
   username: string;
 /**
  * @evidence prisma:profiles.display_name Carries or derives the persisted value used by this property.
  */
   displayName: string;
 /**
  * @evidence prisma:profiles.bio Carries or derives the persisted value used by this property.
  */
   bio: string;

 /**
  * @evidence prisma:profiles.avatar_url Carries or derives the persisted value used by this property.
  */
   avatarUrl: null | string;
 /**
  * @evidence prisma:profiles.karma Carries or derives the persisted value used by this property.
  */
   karma: number;
 /**
  * @evidence prisma:posts.id Carries or derives the persisted value used by this property.
  */
   posts: IPage<IPost.ISummary>;
 /**
  * @evidence prisma:comments.id Carries or derives the persisted value used by this property.
  */
   comments: IPage<IComment.ISummary>;
}

export namespace IProfile {
  /** Partial update of the current user's public profile. */
 /**
  * @evidence prisma:profiles Represents the persisted profiles model.
  */
   export interface IUpdate {
 /**
  * @evidence prisma:profiles.display_name Carries or derives the persisted value used by this property.
  */
     displayName?: null | (string & tags.MinLength<1> & tags.MaxLength<80>);
 /**
  * @evidence prisma:profiles.bio Carries or derives the persisted value used by this property.

  */
     bio?: null | (string & tags.MaxLength<5000>);
 /**
  * @evidence prisma:profiles.avatar_url Carries or derives the persisted value used by this property.
  */
     avatarUrl?: null | string;
  }
}





