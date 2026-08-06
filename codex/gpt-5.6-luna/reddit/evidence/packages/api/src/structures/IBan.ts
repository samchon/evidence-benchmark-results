import type { tags } from "typia";

/** Private active community-ban projection. */
 /**
  * @evidence prisma:bans Represents the persisted bans model.
  */
/**
 * The IBan DTO boundary carries the request and response fields used by its owning operations; runtime behavior is proved there and in live tests.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle The IBan contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-001-enter-active-ban-state The IBan contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-002-end-active-ban-state The IBan contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-003-retain-resolved-ban-history The IBan contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations The IBan contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-001-ban-a-user-from-a-community The IBan contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-002-unban-a-user-from-a-community The IBan contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-003-view-a-communitys-banned-users The IBan contract carries the data shape used by this requirement; behavior is owned by the operation.
 */
 export interface IBan {
 /**
  * @evidence prisma:bans.id Carries or derives the persisted value used by this property.
  */
 /** @evidence prisma:bans.user_id Carries the persisted bans.user_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:bans.community_id Carries the persisted bans.community_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:bans.actor_id Carries the persisted bans.actor_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:bans.ended_at Carries the persisted bans.ended_at value or its security-relevant lifecycle.
  */
      id: string & tags.Format<"uuid">;
 /**
  * @evidence prisma:users.id Carries or derives the persisted value used by this property.
  */
   user: IBan.IUser;
 /**
  * @evidence prisma:users.id Carries or derives the persisted value used by this property.
  */
   actor: IBan.IUser;
 /**
  * @evidence prisma:bans.created_at Carries or derives the persisted value used by this property.
  */

   createdAt: string & tags.Format<"date-time">;
}

export namespace IBan {
 /**
  * @evidence prisma:bans Represents the persisted bans model.
  */
   export interface IUser {
    id: string & tags.Format<"uuid">;
 /**
  * @evidence prisma:bans.id Carries or derives the persisted value used by this property.
  */
     username: string;
  }
}



