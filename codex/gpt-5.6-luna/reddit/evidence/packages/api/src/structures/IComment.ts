import type { tags } from "typia";

/** Public nested comment node and its descendants. */
 /**
  * @evidence prisma:comments Represents the persisted comments model.
  */
/**
 * The IComment DTO boundary carries the request and response fields used by its owning operations; runtime behavior is proved there and in live tests.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-comment-model The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-001-define-comment-identity-and-display The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-002-relate-comments-through-unbounded-nesting The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-001-preserve-comment-identity-during-editing The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-002-delete-comment-content-and-preserve-replies The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-001-write-a-top-level-comment The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-002-reply-to-a-comment The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-003-view-a-nested-comment-thread The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-004-sort-comments-on-a-post The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-005-edit-an-authored-comment The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-006-delete-an-authored-comment The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-007-delete-a-community-comment-as-moderator The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-001-submit-a-post-or-comment-report The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-001-validate-same-post-acyclic-reply-relationships The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-002-allow-unlimited-reply-depth The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-003-order-comments-by-best The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-004-order-comments-by-new The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-005-order-comments-by-controversial The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability The IComment contract carries the data shape used by this requirement; behavior is owned by the operation.
 */
 export interface IComment {
 /**
  * @evidence prisma:comments.id Carries or derives the persisted value used by this property.
  */
 /** @evidence prisma:comments.author_id Carries the persisted comments.author_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:comments.post_id Carries the persisted comments.post_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:comments.parent_id Carries the persisted comments.parent_id value or its security-relevant lifecycle.
  */
      id: string & tags.Format<"uuid">;
 /**
  * @evidence prisma:users.id Carries or derives the persisted value used by this property.
  */
   author: null | IComment.IUser;
 /**
  * @evidence prisma:comments.text Carries or derives the persisted value used by this property.
  */
     text: null | string;
 /**
  * @evidence prisma:comments.deleted_at Carries or derives the persisted value used by this property.
  */
     deleted: boolean;
 /**

  * @evidence prisma:votes.value Carries or derives the persisted value used by this property.
  */
     score: number;
 /**
  * @evidence prisma:comments.created_at Carries or derives the persisted value used by this property.
  */
     createdAt: string & tags.Format<"date-time">;
 /**
  * @evidence prisma:comments.updated_at Carries or derives the persisted value used by this property.
  */
   updatedAt: null | (string & tags.Format<"date-time">);
 /**
  * @evidence prisma:comments.id Carries or derives the persisted value used by this property.
  */
   children: IComment[];
}

export namespace IComment {
 /**
  * @evidence prisma:comments Represents the persisted comments model.
  */
   export interface ISummary {
    id: string & tags.Format<"uuid">;
    text: null | string;
    deleted: boolean;
    score: number;
    createdAt: string & tags.Format<"date-time">;
  }
 /**
  * @evidence prisma:comments Represents the persisted comments model.

  */
   export interface ICreate {
 /**
  * @evidence prisma:comments.text Carries or derives the persisted value used by this property.
  */
     text: string & tags.MinLength<1> & tags.MaxLength<10000>;
  }
 /**
  * @evidence prisma:comments Represents the persisted comments model.
  */
   export interface IUpdate {
    text: string & tags.MinLength<1> & tags.MaxLength<10000>;
  }
 /**
  * @evidence prisma:comments Represents the persisted comments model.
  */
  export interface IRequest {
 /**
  * @evidence prisma:comments.id Carries or derives the persisted value used by this property.
  */
     page?: null | (number & tags.Type<"uint32"> & tags.Minimum<1>);

     continuation?: null | string;
 /**
  * @evidence prisma:comments.id Carries or derives the persisted value used by this property.
  */
     limit?: null | (number & tags.Type<"uint32"> & tags.Maximum<100>);
 /**
  * @evidence prisma:comments.id Carries or derives the persisted value used by this property.
  */

     sort?: null | "best" | "new" | "controversial";
  }
 /**
  * @evidence prisma:comments Represents the persisted comments model.
  */
   export interface IUser {
    id: string & tags.Format<"uuid">;
 /**
  * @evidence prisma:comments.id Carries or derives the persisted value used by this property.
  */
     username: string;
  }
}



