import type { IPage } from "../typings";
import type { tags } from "typia";

/** Public post with one type-specific payload and live aggregates. */
 /**
  * @evidence prisma:posts Represents the persisted posts model.
  */
/**
 * The IPost DTO boundary carries the request and response fields used by its owning operations; runtime behavior is proved there and in live tests.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-post-model The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-001-define-post-identity-and-relationships The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-002-define-post-types-and-payloads The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-003-define-post-participation-measures The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-001-preserve-post-identity-during-editing The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-002-delete-a-post-and-dependent-participation The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-001-create-a-post The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-002-view-a-single-post The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-003-edit-an-authored-post The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-004-delete-an-authored-post The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-001-view-the-authenticated-home-feed The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-002-view-the-public-popular-feed The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-001-enforce-case-insensitive-email-and-username-uniqueness The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-002-require-complete-registration-credentials The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-003-reserve-deleted-account-identifiers The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-post-content-rules The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-001-validate-required-title-and-exact-post-payload The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-002-validate-link-and-image-payloads The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-003-restrict-post-editing-to-title-and-same-type-content The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-001-order-feeds-by-new The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-002-order-feeds-by-top-and-selected-time-range The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-003-order-feeds-by-hot The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-004-order-feeds-by-controversial The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-005-apply-deterministic-pagination-boundaries The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-004-keep-relative-time-anchored-to-creation The IPost contract carries the data shape used by this requirement; behavior is owned by the operation.
 */
 export interface IPost {
 /**
  * @evidence prisma:posts.id Carries or derives the persisted value used by this property.
  */
 /** @evidence prisma:posts.author_id Carries the persisted posts.author_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:posts.community_id Carries the persisted posts.community_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:posts.deleted_at Carries the persisted posts.deleted_at value or its security-relevant lifecycle.
  */
      id: string & tags.Format<"uuid">;
 /**
  * @evidence prisma:posts.title Carries or derives the persisted value used by this property.
  */
     title: string;
 /**
  * @evidence prisma:posts.type Carries or derives the persisted value used by this property.
  */
     type: "text" | "link" | "image";
 /**
  * @evidence prisma:posts.text Carries or derives the persisted value used by this property.
  */
   text: null | string;

 /**
  * @evidence prisma:posts.url Carries or derives the persisted value used by this property.
  */
   url: null | (string & tags.Format<"uri">);
 /**
  * @evidence prisma:posts.image_url Carries or derives the persisted value used by this property.
  */
   imageUrl: null | string;
 /**
  * @evidence prisma:users.id Carries or derives the persisted value used by this property.
  */
   author: IPost.IUser;
 /**
  * @evidence prisma:communities.id Carries or derives the persisted value used by this property.
  */
   community: IPost.ICommunity;
 /**
  * @evidence prisma:votes.value Carries or derives the persisted value used by this property.
  */
     score: number;
 /**
  * @evidence prisma:comments.id Carries or derives the persisted value used by this property.
  */
     commentCount: number & tags.Type<"uint32">;
 /**
  * @evidence prisma:posts.created_at Carries or derives the persisted value used by this property.
  */
     createdAt: string & tags.Format<"date-time">;
 /**
  * @evidence prisma:posts.updated_at Carries or derives the persisted value used by this property.

  */
   updatedAt: null | (string & tags.Format<"date-time">);
}

export namespace IPost {
  /** Compact post card used by feeds and authored lists. */
 /**
  * @evidence prisma:posts Represents the persisted posts model.
  */
   export interface ISummary {
    id: string & tags.Format<"uuid">;
    title: string;
    type: "text" | "link" | "image";
 /**
  * @evidence prisma:posts.text Carries or derives the persisted value used by this property.
  */
     preview: string;
 /**
  * @evidence prisma:users.id Carries or derives the persisted value used by this property.
  */
     author: IUser;
 /**
  * @evidence prisma:communities.id Carries or derives the persisted value used by this property.
  */
     community: ICommunity;
    score: number;
    commentCount: number & tags.Type<"uint32">;
    createdAt: string & tags.Format<"date-time">;
  }
  /** Creation payload with exactly one payload variant. */

 /**
  * @evidence prisma:posts Represents the persisted posts model.
  */
   export interface ICreate {
 /**
  * @evidence prisma:posts.title Carries or derives the persisted value used by this property.
  */
     title: string & tags.MinLength<1> & tags.MaxLength<300>;
    type: "text" | "link" | "image";
 /**
  * @evidence prisma:posts.text Carries or derives the persisted value used by this property.
  */
     text?: null | string;
 /**
  * @evidence prisma:posts.url Carries or derives the persisted value used by this property.
  */
     url?: null | (string & tags.Format<"uri">);
 /**
  * @evidence prisma:posts.image_url Carries or derives the persisted value used by this property.
  */
     imageUrl?: null | string;
  }
  /** Partial update preserving the existing payload type. */
 /**
  * @evidence prisma:posts Represents the persisted posts model.
  */
   export interface IUpdate {
 /**
  * @evidence prisma:posts.title Carries or derives the persisted value used by this property.
  */

     title?: null | (string & tags.MinLength<1> & tags.MaxLength<300>);
    text?: null | string;
    url?: null | (string & tags.Format<"uri">);
    imageUrl?: null | string;
  }
  /** Feed sort and page controls. */
 /**
  * @evidence prisma:posts Represents the persisted posts model.
  */
  export interface IRequest {
 /**
  * @evidence prisma:posts.id Carries or derives the persisted value used by this property.
  */
     page?: null | (number & tags.Type<"uint32"> & tags.Minimum<1>);

     continuation?: null | string;
 /**
  * @evidence prisma:posts.id Carries or derives the persisted value used by this property.
  */
     limit?: null | (number & tags.Type<"uint32"> & tags.Maximum<100>);
 /**
  * @evidence prisma:posts.id Carries or derives the persisted value used by this property.
  */
     sort?: null | "hot" | "new" | "top" | "controversial";
 /**
  * @evidence prisma:posts.id Carries or derives the persisted value used by this property.
  */
     range?: null | "today" | "week" | "month" | "year" | "all";
  }
 /**

  * @evidence prisma:posts Represents the persisted posts model.
  */
   export interface IUser {
    id: string & tags.Format<"uuid">;
 /**
  * @evidence prisma:posts.id Carries or derives the persisted value used by this property.
  */
     username: string;
  }
 /**
  * @evidence prisma:posts Represents the persisted posts model.
  */
   export interface ICommunity {
    id: string & tags.Format<"uuid">;
 /**
  * @evidence prisma:posts.id Carries or derives the persisted value used by this property.
  */
     name: string;
  }
}



