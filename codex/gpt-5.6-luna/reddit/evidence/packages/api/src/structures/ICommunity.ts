import type { IPage } from "../typings";
import type { tags } from "typia";

/** Public community descriptor and lifecycle state. */
 /**
  * @evidence prisma:communities Represents the persisted communities model.
  * @evidence prisma:moderators Represents moderator assignments.
  */
/**
 * The ICommunity DTO boundary carries the request and response fields used by its owning operations; runtime behavior is proved there and in live tests.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-community-model The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-001-define-community-attributes The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-002-relate-a-community-to-its-owner The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-003-relate-communities-to-subscribers The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-004-relate-communities-to-content-and-moderation The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-001-maintain-active-community-ownership The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-002-transfer-ownership-after-owner-deletion The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-003-archive-an-ownerless-community The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-004-enforce-archived-community-read-only-state The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-community-operations The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-002-browse-all-communities The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-003-search-communities-by-name The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-005-delete-a-community-post-as-moderator The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-003-view-a-public-community-feed The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-002-add-a-moderator-as-community-moderator The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-003-remove-a-moderator-as-community-owner The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-001-validate-community-creation-fields-and-unique-name The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-002-match-and-order-community-name-search The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-002-protect-owner-and-moderator-assignments-from-moderator-removal The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-003-protect-the-owner-from-community-bans The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content The ICommunity contract carries the data shape used by this requirement; behavior is owned by the operation.
 */
 export interface ICommunity {
 /**
  * @evidence prisma:communities.id Carries or derives the persisted value used by this property.
  */
 /** @evidence prisma:communities.name_normalized Carries the persisted communities.name_normalized value or its security-relevant lifecycle.
  */
 /** @evidence prisma:communities.owner_id Carries the persisted communities.owner_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:communities.created_at Carries the persisted communities.created_at value or its security-relevant lifecycle.
  */
 /** @evidence prisma:moderators.id Carries the persisted moderators.id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:moderators.user_id Carries the persisted moderators.user_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:moderators.community_id Carries the persisted moderators.community_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:moderators.created_at Carries the persisted moderators.created_at value or its security-relevant lifecycle.
  */
 /** @evidence prisma:moderators.revoked_at Carries the persisted moderators.revoked_at value or its security-relevant lifecycle.
  */
    id: string & tags.Format<"uuid">;
 /**

  * @evidence prisma:communities.name Carries or derives the persisted value used by this property.
  */
   name: string;
 /**
  * @evidence prisma:communities.description Carries or derives the persisted value used by this property.
  */
   description: string;
 /**
  * @evidence prisma:communities.icon_url Carries or derives the persisted value used by this property.
  */
   iconUrl: null | string;
 /**
  * @evidence prisma:communities.status Carries or derives the persisted value used by this property.
  */
   status: "active" | "archived";
 /**
  * @evidence prisma:subscriptions.id Carries or derives the persisted value used by this property.
  */
   subscriberCount: number & tags.Type<"uint32">;
}

export namespace ICommunity {
  /** Creates a community and bootstraps owner subscription. */
 /**
  * @evidence prisma:communities Represents the persisted communities model.
  */
   export interface ICreate {
 /**
  * @evidence prisma:communities.name Carries or derives the persisted value used by this property.
  */

     name: string & tags.MinLength<3> & tags.MaxLength<80>;
 /**
  * @evidence prisma:communities.description Carries or derives the persisted value used by this property.
  */
     description: string & tags.MinLength<1> & tags.MaxLength<5000>;
 /**
  * @evidence prisma:communities.icon_url Carries or derives the persisted value used by this property.
  */
     iconUrl?: null | string;
  }
  /** Name-filtered public community listing. */
 /**
  * @evidence prisma:communities Represents the persisted communities model.
  */
  export interface IRequest {
 /**
  * @evidence prisma:communities.id Carries or derives the persisted value used by this property.
  */
    page?: null | (number & tags.Type<"uint32"> & tags.Minimum<1>);

    continuation?: null | string;
 /**
  * @evidence prisma:communities.id Carries or derives the persisted value used by this property.
  */
     limit?: null | (number & tags.Type<"uint32"> & tags.Maximum<100>);
 /**
  * @evidence prisma:communities.id Carries or derives the persisted value used by this property.
  */
     search?: null | string;
  }

}



