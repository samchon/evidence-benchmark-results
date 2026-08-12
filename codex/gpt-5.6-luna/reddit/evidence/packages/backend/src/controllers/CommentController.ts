import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { tags } from "typia";
import type { IPage, IRedditComment } from "@benchmark/reddit-api";
import { RedditAuth } from "../decorators/RedditAuth";
import { RedditProvider } from "../providers/RedditProvider";

/** Publishes nested comment creation, reading, editing, and deletion. */
@Controller("comment")
export class CommentController {
  /** Creates a top-level comment without requiring subscription. @tag Comment */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations Publishes comment operations. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-comment-001-write-a-top-level-comment Publishes top-level creation. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-001-write-a-top-level-comment Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment Publishes non-subscriber commenting. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting Publishes ban refusal. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-comment-comment-model Publishes the comment model. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-comment-model Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-comment-001-define-comment-identity-and-display Publishes comment identity. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-001-define-comment-identity-and-display Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-comment-002-relate-comments-through-unbounded-nesting Publishes comment relations. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-002-relate-comments-through-unbounded-nesting Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_comments Persists comment content. */
  /** @evidenceReview prisma:reddit_comments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_posts Reads the containing post. */
  /** @evidenceReview prisma:reddit_posts Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Post("post/:postId")
  public async create(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("postId") postId: string & tags.Format<"uuid">,
    @core.TypedBody() body: IRedditComment.ICreate,
  ): Promise<IRedditComment> {
    return RedditProvider.commentCreate(actor, postId, body);
  }

  /** Replies to an available comment at any finite depth. @tag Comment */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-comment-002-reply-to-a-comment Publishes replies. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-002-reply-to-a-comment Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-comment-001-validate-same-post-acyclic-reply-relationships Publishes reply integrity. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-001-validate-same-post-acyclic-reply-relationships Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-comment-002-allow-unlimited-reply-depth Publishes recursive depth. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-002-allow-unlimited-reply-depth Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_comments Validates and persists reply state. */
  /** @evidenceReview prisma:reddit_comments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Post(":parentId/reply")
  public async reply(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("parentId") parentId: string & tags.Format<"uuid">,
    @core.TypedBody() body: IRedditComment.IReply,
  ): Promise<IRedditComment> {
    return RedditProvider.commentReply(actor, parentId, body);
  }

  /** Reads a recursively nested public thread. @tag Comment */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-comment-003-view-a-nested-comment-thread Publishes nested thread reads. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-003-view-a-nested-comment-thread Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-comment-004-sort-comments-on-a-post Publishes comment sorting. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-004-sort-comments-on-a-post Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules Publishes tree and sorting rules. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules Compared recursive tree assembly, sibling sorting, and deleted-node pruning with the nested-comment journey; verified all supported orders preserve the required branch structure. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-comment-003-order-comments-by-best Publishes Best ordering. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-003-order-comments-by-best Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-comment-004-order-comments-by-new Publishes New ordering. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-004-order-comments-by-new Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-comment-005-order-comments-by-controversial Publishes Controversial ordering. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-005-order-comments-by-controversial Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Publishes comment pagination. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size Publishes bounded page size. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state Publishes stale continuation recovery. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state Compared comment-route scope binding and reset handling with the continuation contract; verified mismatched traversal state starts a fresh first page. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity Publishes thread continuity. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation Publishes stable thread continuation. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation Compared root-page selection with recursive descendants and signed continuation state; verified page size and branch order remain stable. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation Publishes reset metadata. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure Publishes recursive descendants. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure Compared recursive reply assembly and deleted-marker pruning with the deep-reply/deletion assertions; verified surviving descendants remain reachable without exposing removed content. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-004-keep-relative-time-anchored-to-creation Publishes creation timestamps. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-004-keep-relative-time-anchored-to-creation Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Publishes comment scores. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability Publishes comment availability. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Publishes deletion markers. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Publishes public comments. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_comments Reads the public thread. */
  /** @evidenceReview prisma:reddit_comments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Patch("post/:postId")
  public async index(
    @core.TypedParam("postId") postId: string & tags.Format<"uuid">,
    @core.TypedBody() body: IRedditComment.IRequest,
  ): Promise<IPage<IRedditComment>> {
    return RedditProvider.commentIndex(postId, body);
  }

  /** Edits only the current author's available comment text. @tag Comment */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-comment-005-edit-an-authored-comment Publishes comment editing. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-005-edit-an-authored-comment Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle Publishes comment lifecycle. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-001-preserve-comment-identity-during-editing Preserves comment identity. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-life-001-preserve-comment-identity-during-editing Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_comments Updates authored comment text. */
  /** @evidenceReview prisma:reddit_comments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Put(":id")
  public async update(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() body: IRedditComment.IUpdate,
  ): Promise<IRedditComment> {
    return RedditProvider.commentUpdate(actor, id, body);
  }

  /** Permanently removes current-author comment content and preserves replies when needed. @tag Comment */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-comment-006-delete-an-authored-comment Publishes authored comment deletion. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-006-delete-an-authored-comment Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-002-delete-comment-content-and-preserve-replies Publishes deletion markers and reply preservation. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-life-002-delete-comment-content-and-preserve-replies Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_comments Deletes comment content and preserves descendants. */
  /** @evidenceReview prisma:reddit_comments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Delete(":id")
  public async erase(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<{ success: true }> {
    await RedditProvider.commentErase(actor, id);
    return { success: true };
  }
}
