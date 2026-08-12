import { tags } from "typia";
import type { IPage } from "../typings/IPage";
import type { IRedditCommunity } from "./IRedditCommunity";
import type { IRedditUser } from "./IRedditUser";

/** Complete public post response. */
/** @evidence prisma:reddit_posts Represents persisted post identity and payload. */
/** @evidenceReview prisma:reddit_posts Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-post-post-model Defines complete and summary post shapes. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-post-model Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle Carries post lifecycle state. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations Defines post create, read, edit, and delete payloads. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-post-operations Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-post-001-create-a-post Carries post creation input and result. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-001-create-a-post Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-post-002-view-a-single-post Carries complete public post output. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-002-view-a-single-post Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-post-003-edit-an-authored-post Carries author edit input. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-003-edit-an-authored-post Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys Defines feed card and ranking payloads. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-feed-001-view-the-authenticated-home-feed Carries home feed items. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-001-view-the-authenticated-home-feed Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-feed-002-view-the-public-popular-feed Carries popular feed items. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-002-view-the-public-popular-feed Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-feed-003-view-a-public-community-feed Carries community feed items. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-003-view-a-public-community-feed Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range Carries feed sort and range input. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results Carries feed pagination input. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards Carries feed card presentation data. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-post-post-content-rules Carries typed post payloads. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-post-content-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-post-001-validate-required-title-and-exact-post-payload Carries title and exclusive payload fields. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-001-validate-required-title-and-exact-post-payload Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-post-002-validate-link-and-image-payloads Carries URL and image payload boundaries. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-002-validate-link-and-image-payloads Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-post-003-restrict-post-editing-to-title-and-same-type-content Carries author-editable fields. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-003-restrict-post-editing-to-title-and-same-type-content Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules Carries feed sort and range fields. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-feed-001-order-feeds-by-new Carries immutable creation time in feed items. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-001-order-feeds-by-new Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-feed-002-order-feeds-by-top-and-selected-time-range Carries top range input. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-002-order-feeds-by-top-and-selected-time-range Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-feed-003-order-feeds-by-hot Carries hot sort input. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-003-order-feeds-by-hot Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-feed-004-order-feeds-by-controversial Carries controversial sort input. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-004-order-feeds-by-controversial Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-feed-005-apply-deterministic-pagination-boundaries Carries bounded feed pagination. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-005-apply-deterministic-pagination-boundaries Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Carries post payloads subject to membership and ban checks. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation Carries the post creation boundary. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting Carries post content subject to the ban. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access Carries public post viewing shape. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules Carries accepted image post payloads. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-media-001-validate-uploaded-image-format-and-size Carries image boundary input. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-media-001-validate-uploaded-image-format-and-size Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-media-002-present-uploaded-images-and-post-thumbnails Carries full image and preview output. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-media-002-present-uploaded-images-and-post-thumbnails Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity Carries feed continuation metadata through IPage. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation Carries bounded page requests. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation Carries reset and next-page metadata through IPage. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Carries the shared page-size and continuation boundary. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size Carries the bounded requested page size. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state Carries scoped continuation and reset metadata. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-004-keep-relative-time-anchored-to-creation Carries immutable creation timestamps. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-004-keep-relative-time-anchored-to-creation Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Carries score and comment count output. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Carries the resulting post score. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability Carries the post comment count. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Carries deletion-consistent post reads. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Carries public post content. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
export interface IRedditPost {
  /**
   * Post identifier.
   * @evidence prisma:reddit_posts.id Carries the post key.
   * @evidenceReview prisma:reddit_posts.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Original author.
   * @evidence prisma:reddit_posts.author_id Carries the author relation.
   * @evidenceReview prisma:reddit_posts.author_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  author: IRedditUser.ISummary;
  /**
   * Containing community.
   * @evidence prisma:reddit_posts.community_id Carries the community relation.
   * @evidenceReview prisma:reddit_posts.community_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  community: IRedditCommunity.ISummary;
  /**
   * Reader-facing title.
   * @evidence prisma:reddit_posts.title Carries the stored title.
   * @evidenceReview prisma:reddit_posts.title Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  title: string;
  /**
   * Text, link, or image discriminator.
   * @evidence prisma:reddit_posts.type Carries the payload kind.
   * @evidenceReview prisma:reddit_posts.type Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  type: "text" | "link" | "image";
  /**
   * Full text for a text post.
   * @evidence prisma:reddit_posts.text Carries the text payload.
   * @evidenceReview prisma:reddit_posts.text Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  text: null | string;
  /**
   * Full URL for a link post.
   * @evidence prisma:reddit_posts.url Carries the link payload.
   * @evidenceReview prisma:reddit_posts.url Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  url: null | string;
  /**
   * Full image payload for an image post.
   * @evidence prisma:reddit_posts.image Carries the full image.
   * @evidenceReview prisma:reddit_posts.image Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  image: null | string;
  /**
   * Current signed vote score.
   * @evidence prisma:reddit_posts.score Carries the materialized score.
   * @evidenceReview prisma:reddit_posts.score Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  score: number;
  /**
   * Current available comment count.
   * @evidence prisma:reddit_posts.comment_count Carries the materialized count.
   * @evidenceReview prisma:reddit_posts.comment_count Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  commentCount: number & tags.Type<"uint32">;
  /**
   * Immutable creation instant.
   * @evidence prisma:reddit_posts.created_at Carries the original creation time.
   * @evidenceReview prisma:reddit_posts.created_at Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  createdAt: string & tags.Format<"date-time">;
}

export namespace IRedditPost {
  /** Feed and profile post card. */
  export interface ISummary {
    /**
     * Post identifier.
     * @evidence prisma:reddit_posts.id Carries the card key.
     * @evidenceReview prisma:reddit_posts.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    id: string & tags.Format<"uuid">;
    /**
     * Post title.
     * @evidence prisma:reddit_posts.title Carries the card title.
     * @evidenceReview prisma:reddit_posts.title Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    title: string;
    /**
     * Author identity.
     * @evidence prisma:reddit_posts.author_id Carries the card author.
     * @evidenceReview prisma:reddit_posts.author_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    author: IRedditUser.ISummary;
    /**
     * Community identity.
     * @evidence prisma:reddit_posts.community_id Carries the card community.
     * @evidenceReview prisma:reddit_posts.community_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    community: IRedditCommunity.ISummary;
    /**
     * Type-specific preview.
     * @evidence prisma:reddit_posts.thumbnail Carries the derived preview.
     * @evidenceReview prisma:reddit_posts.thumbnail Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    preview: string;
    /**
     * Current signed score.
     * @evidence prisma:reddit_posts.score Carries card score.
     * @evidenceReview prisma:reddit_posts.score Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    score: number;
    /**
     * Current available comment count.
     * @evidence prisma:reddit_posts.comment_count Carries card count.
     * @evidenceReview prisma:reddit_posts.comment_count Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    commentCount: number & tags.Type<"uint32">;
    /**
     * Immutable creation instant.
     * @evidence prisma:reddit_posts.created_at Carries card age origin.
     * @evidenceReview prisma:reddit_posts.created_at Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    createdAt: string & tags.Format<"date-time">;
  }

  /** New post input. */
  export interface ICreate {
    /** Required title. */
    title: string & tags.MinLength<1> & tags.MaxLength<300>;
    /** Selected payload kind. */
    type: "text" | "link" | "image";
    /** Text payload for text posts. */
    text?: null | (string & tags.MinLength<1> & tags.MaxLength<40000>);
    /** Absolute HTTP(S) URL for link posts. */
    url?: null | (string & tags.MinLength<1> & tags.MaxLength<2048>);
    /** Image payload for image posts. */
    image?: null | string;
  }

  /** Author-only mutable post input. */
  export interface IUpdate {
    /** Replacement title, when supplied. */
    title?: null | (string & tags.MinLength<1> & tags.MaxLength<300>);
    /** Replacement payload within the original type. */
    text?: null | (string & tags.MinLength<1> & tags.MaxLength<40000>);
    /** Replacement URL within the original type. */
    url?: null | (string & tags.MinLength<1> & tags.MaxLength<2048>);
    /** Replacement image within the original type. */
    image?: null | string;
  }

  /** Shared feed request. */
  export interface IRequest extends IPage.IRequest {
    /** Hot, New, Top, or Controversial. */
    sort?: null | "hot" | "new" | "top" | "controversial";
    /** Required only with Top sort. */
    range?: null | "today" | "week" | "month" | "year" | "all";
  }
}
