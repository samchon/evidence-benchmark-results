import { tags } from "typia";
import type { IPage } from "../typings/IPage";

/** Public community identity, lifecycle, and derived subscription count. */
/** @evidence prisma:reddit_communities Represents persisted community identity and lifecycle. */
/** @evidenceReview prisma:reddit_communities Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-community-community-model Defines the public community response. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-community-model Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle Carries owner and archive state. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-community-community-operations Defines community create and discovery payloads. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-community-operations Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community Carries community creation input and result. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-community-002-browse-all-communities Carries catalog results. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-002-browse-all-communities Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-community-003-search-communities-by-name Carries name-search input and results. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-003-search-communities-by-name Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules Carries community validation and search fields. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-community-001-validate-community-creation-fields-and-unique-name Carries constrained creation values. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-community-001-validate-community-creation-fields-and-unique-name Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-community-002-match-and-order-community-name-search Carries normalized-name search input. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-community-002-match-and-order-community-name-search Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Carries community status used by eligibility responses. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules Carries scoped community identity. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community Carries the target community boundary. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-moderation-002-protect-owner-and-moderator-assignments-from-moderator-removal Carries owner-scoped community identity. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-002-protect-owner-and-moderator-assignments-from-moderator-removal Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-moderation-003-protect-the-owner-from-community-bans Carries owner-scoped community identity. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-003-protect-the-owner-from-community-bans Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Carries subscriber count. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent Carries the count produced by subscriptions. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
export interface IRedditCommunity {
  /**
   * Community identifier.
   * @evidence prisma:reddit_communities.id Carries the community key.
   * @evidenceReview prisma:reddit_communities.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Case-preserving public name.
   * @evidence prisma:reddit_communities.name Carries the public name.
   * @evidenceReview prisma:reddit_communities.name Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  name: string;
  /**
   * Public description.
   * @evidence prisma:reddit_communities.description Carries the description.
   * @evidenceReview prisma:reddit_communities.description Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  description: string;
  /**
   * Accepted public icon payload.
   * @evidence prisma:reddit_communities.icon Carries the icon.
   * @evidenceReview prisma:reddit_communities.icon Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  icon: string;
  /**
   * Active or archived status.
   * @evidence prisma:reddit_communities.status Carries lifecycle status.
   * @evidenceReview prisma:reddit_communities.status Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  status: "active" | "archived";
  /** Count of active subscriptions. */
  subscriberCount: number & tags.Type<"uint32">;
  /**
   * Current owner when the community is active.
   * @evidence prisma:reddit_communities.owner_id Carries the owner relation.
   * @evidenceReview prisma:reddit_communities.owner_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  owner: null | IRedditCommunity.IOwner;
}

export namespace IRedditCommunity {
  /** Compact public community identity. */
  export interface ISummary {
    /**
     * Community identifier.
     * @evidence prisma:reddit_communities.id Carries the summary key.
     * @evidenceReview prisma:reddit_communities.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    id: string & tags.Format<"uuid">;
    /**
     * Public name.
     * @evidence prisma:reddit_communities.name Carries the summary name.
     * @evidenceReview prisma:reddit_communities.name Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    name: string;
    /**
     * Public description.
     * @evidence prisma:reddit_communities.description Carries the summary description.
     * @evidenceReview prisma:reddit_communities.description Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    description: string;
    /**
     * Public icon payload.
     * @evidence prisma:reddit_communities.icon Carries the summary icon.
     * @evidenceReview prisma:reddit_communities.icon Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    icon: string;
    /**
     * Active or archived status.
     * @evidence prisma:reddit_communities.status Carries the summary status.
     * @evidenceReview prisma:reddit_communities.status Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    status: "active" | "archived";
    /** Count of active subscriptions. */
    subscriberCount: number & tags.Type<"uint32">;
  }

  /** Public owner identity. */
  export interface IOwner {
    /** Owner account identifier. */
    id: string & tags.Format<"uuid">;
    /** Owner username. */
    username: string;
  }

  /** Community creation input. */
  export interface ICreate {
    /** Unique public name. */
    name: string & tags.MinLength<3> & tags.MaxLength<50> & tags.Pattern<"^[A-Za-z0-9_-]+$">;
    /** Nonblank public description. */
    description: string & tags.MinLength<1> & tags.MaxLength<1000>;
    /** Accepted icon payload. */
    icon: string & tags.MinLength<1>;
  }

  /** Public catalog/search input. */
  export interface IRequest extends IPage.IRequest {
    /** Case-insensitive name substring. */
    search?: null | string;
  }
}
