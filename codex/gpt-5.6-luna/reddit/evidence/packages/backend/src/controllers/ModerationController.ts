import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { tags } from "typia";
import type { IPage, IRedditBan, IRedditReport, IRedditModeratorAssignment, IRedditModerationAction } from "@benchmark/reddit-api";
import { RedditAuth } from "../decorators/RedditAuth";
import { RedditProvider } from "../providers/RedditProvider";

/** Publishes community-scoped moderation and private queue operations. */
@Controller("community/:communityId/moderation")
export class ModerationController {
  /** Deletes any post as the current community owner or moderator. @tag Moderation */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-post-005-delete-a-community-post-as-moderator Publishes moderator post deletion. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-005-delete-a-community-post-as-moderator Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules Publishes moderation authority. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community Publishes community scope. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private Keeps moderation scoped privately. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_posts Deletes moderated post state. */
  /** @evidenceReview prisma:reddit_posts Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_moderator_assignments Checks moderator authority. */
  /** @evidenceReview prisma:reddit_moderator_assignments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Delete("post/:postId")
  public async deletePost(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
    @core.TypedParam("postId") postId: string & tags.Format<"uuid">,
  ): Promise<{ success: true }> {
    await RedditProvider.moderationDeletePost(actor, communityId, postId);
    return { success: true };
  }

  /** Deletes any comment as the current community owner or moderator. @tag Moderation */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-comment-007-delete-a-community-comment-as-moderator Publishes moderator comment deletion. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-007-delete-a-community-comment-as-moderator Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community Publishes community scope. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_comments Deletes moderated comment state. */
  /** @evidenceReview prisma:reddit_comments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_moderator_assignments Checks moderator authority. */
  /** @evidenceReview prisma:reddit_moderator_assignments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Delete("comment/:commentId")
  public async deleteComment(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
    @core.TypedParam("commentId") commentId: string & tags.Format<"uuid">,
  ): Promise<{ success: true }> {
    await RedditProvider.moderationDeleteComment(actor, communityId, commentId);
    return { success: true };
  }

  /** Appoints an active platform user as a moderator. @tag Moderation */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations Publishes moderator assignments. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner Publishes owner appointment. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-role-002-add-a-moderator-as-community-moderator Publishes peer appointment. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-002-add-a-moderator-as-community-moderator Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Publishes scoped authority. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-002-owner-appointment-of-moderators Publishes owner appointment authority. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-002-owner-appointment-of-moderators Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-003-moderator-appointment-of-peers Publishes peer appointment authority. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-003-moderator-appointment-of-peers Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community Publishes scoped assignment. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_moderator_assignments Persists the assignment. */
  /** @evidenceReview prisma:reddit_moderator_assignments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_communities Checks community ownership. */
  /** @evidenceReview prisma:reddit_communities Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_users Reads the assigned account. */
  /** @evidenceReview prisma:reddit_users Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Put("moderator/:userId")
  public async appoint(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
    @core.TypedParam("userId") userId: string & tags.Format<"uuid">,
  ): Promise<IRedditModeratorAssignment> {
    return RedditProvider.moderatorAppoint(actor, communityId, userId);
  }

  /** Removes a moderator assignment as the current owner. @tag Moderation */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-role-003-remove-a-moderator-as-community-owner Publishes moderator removal. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-003-remove-a-moderator-as-community-owner Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-004-owner-removal-of-moderators Publishes owner removal authority. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-004-owner-removal-of-moderators Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-005-protect-owner-and-moderator-assignments Publishes assignment protection. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-005-protect-owner-and-moderator-assignments Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-moderation-002-protect-owner-and-moderator-assignments-from-moderator-removal Publishes removal protection. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-002-protect-owner-and-moderator-assignments-from-moderator-removal Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_moderator_assignments Revokes the assignment. */
  /** @evidenceReview prisma:reddit_moderator_assignments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Delete("moderator/:userId")
  public async removeModerator(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
    @core.TypedParam("userId") userId: string & tags.Format<"uuid">,
  ): Promise<{ success: true }> {
    await RedditProvider.moderatorRemove(actor, communityId, userId);
    return { success: true };
  }

  /** Bans one eligible account from the community. @tag Moderation */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations Publishes ban operations. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-ban-001-ban-a-user-from-a-community Publishes ban creation. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-001-ban-a-user-from-a-community Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle Publishes ban lifecycle. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-ban-001-enter-active-ban-state Publishes active bans. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-ban-001-enter-active-ban-state Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-moderation-003-protect-the-owner-from-community-bans Publishes owner protection. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-003-protect-the-owner-from-community-bans Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_bans Persists active ban state. */
  /** @evidenceReview prisma:reddit_bans Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_users Reads the ban target. */
  /** @evidenceReview prisma:reddit_users Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_communities Checks community scope. */
  /** @evidenceReview prisma:reddit_communities Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Put("ban/:userId")
  public async ban(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
    @core.TypedParam("userId") userId: string & tags.Format<"uuid">,
  ): Promise<IRedditBan> {
    return RedditProvider.ban(actor, communityId, userId);
  }

  /** Ends one active community ban. @tag Moderation */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-ban-002-unban-a-user-from-a-community Publishes unban. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-002-unban-a-user-from-a-community Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-ban-002-end-active-ban-state Publishes ban ending. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-ban-002-end-active-ban-state Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_bans Ends active ban state. */
  /** @evidenceReview prisma:reddit_bans Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Delete("ban/:userId")
  public async unban(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
    @core.TypedParam("userId") userId: string & tags.Format<"uuid">,
  ): Promise<{ success: true }> {
    await RedditProvider.unban(actor, communityId, userId);
    return { success: true };
  }

  /** Lists active banned users in reverse activation order. @tag Moderation */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-ban-003-view-a-communitys-banned-users Publishes ban listing. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-003-view-a-communitys-banned-users Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-ban-003-retain-resolved-ban-history Publishes retained ban history. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-ban-003-retain-resolved-ban-history Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Publishes paginated ban listing. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_bans Reads scoped bans. */
  /** @evidenceReview prisma:reddit_bans Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Patch("bans")
  public async bans(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
    @core.TypedBody() body: IPage.IRequest,
  ): Promise<IPage<IRedditBan>> {
    return RedditProvider.bans(actor, communityId, body);
  }

  /** Submits a post or comment report to its exact community queue. @tag Moderation */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution Publishes reporting operations. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-report-001-submit-a-post-or-comment-report Publishes report submission. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-001-submit-a-post-or-comment-report Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-report-content-report-model Publishes report state. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-content-report-model Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-report-001-define-report-target-reporter-and-reason Publishes report target and reason. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-001-define-report-target-reporter-and-reason Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-report-002-relate-unresolved-reports-to-a-community-queue Publishes queue relation. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-002-relate-unresolved-reports-to-a-community-queue Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-report-003-prevent-duplicate-unresolved-reports Publishes duplicate prevention. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-003-prevent-duplicate-unresolved-reports Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle Publishes report lifecycle. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-report-life-001-enter-unresolved-report-state Publishes unresolved state. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-001-enter-unresolved-report-state Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules Publishes reporting rules. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-reporting-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-report-001-require-a-valid-report-target-and-reason Publishes target validation. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-001-require-a-valid-report-target-and-reason Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-report-002-refuse-duplicate-unresolved-reports Publishes duplicate refusal. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-002-refuse-duplicate-unresolved-reports Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private Keeps reports private to the community. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_reports Persists the report. */
  /** @evidenceReview prisma:reddit_reports Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_posts Validates post targets. */
  /** @evidenceReview prisma:reddit_posts Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_comments Validates comment targets. */
  /** @evidenceReview prisma:reddit_comments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Post("report")
  public async report(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
    @core.TypedBody() body: IRedditReport.ICreate,
  ): Promise<IRedditReport> {
    return RedditProvider.reportCreate(actor, communityId, body);
  }

  /** Lists unresolved reports for current community moderators. @tag Moderation */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports Publishes the private queue. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution Restricts queue visibility. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Publishes paginated reports. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_reports Reads unresolved reports. */
  /** @evidenceReview prisma:reddit_reports Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Patch("reports")
  public async reports(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
    @core.TypedBody() body: IPage.IRequest,
  ): Promise<IPage<IRedditReport>> {
    return RedditProvider.reports(actor, communityId, body);
  }

  /** Lists resolved private moderation history for the current community moderators. @tag Moderation */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-report-life-004-retain-resolved-moderation-history Publishes retained history. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-004-retain-resolved-moderation-history Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution Publishes resolution history. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private Keeps history private. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Publishes paginated history. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_moderation_actions Reads resolved history. */
  /** @evidenceReview prisma:reddit_moderation_actions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Patch("history")
  public async history(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
    @core.TypedBody() body: IPage.IRequest,
  ): Promise<IPage<IRedditModerationAction>> {
    return RedditProvider.history(actor, communityId, body);
  }

  /** Approves an unresolved report and deletes its target. @tag Moderation */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-report-003-approve-a-report Publishes report approval. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-003-approve-a-report Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-report-life-002-approve-a-report-and-delete-its-target Publishes approval deletion. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-002-approve-a-report-and-delete-its-target Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution Refuses repeat resolution. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_reports Resolves the report. */
  /** @evidenceReview prisma:reddit_reports Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_moderation_actions Records moderation history. */
  /** @evidenceReview prisma:reddit_moderation_actions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_posts Deletes an approved post target. */
  /** @evidenceReview prisma:reddit_posts Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_comments Deletes an approved comment target. */
  /** @evidenceReview prisma:reddit_comments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Post("report/:reportId/approve")
  public async approve(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
    @core.TypedParam("reportId") reportId: string & tags.Format<"uuid">,
  ): Promise<{ success: true }> {
    await RedditProvider.reportApprove(actor, communityId, reportId);
    return { success: true };
  }

  /** Dismisses an unresolved report while retaining its target. @tag Moderation */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-report-004-dismiss-a-report Publishes report dismissal. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-004-dismiss-a-report Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-report-life-003-dismiss-a-report-and-retain-its-target Publishes retained target behavior. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-003-dismiss-a-report-and-retain-its-target Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution Refuses repeat resolution. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_reports Resolves the report. */
  /** @evidenceReview prisma:reddit_reports Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_moderation_actions Records dismissal history. */
  /** @evidenceReview prisma:reddit_moderation_actions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Post("report/:reportId/dismiss")
  public async dismiss(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
    @core.TypedParam("reportId") reportId: string & tags.Format<"uuid">,
  ): Promise<{ success: true }> {
    await RedditProvider.reportDismiss(actor, communityId, reportId);
    return { success: true };
  }
}
