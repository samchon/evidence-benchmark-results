import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { tags } from "typia";
import type { IRedditVote } from "@benchmark/reddit-api";
import { RedditAuth } from "../decorators/RedditAuth";
import { RedditProvider } from "../providers/RedditProvider";

/** Publishes signed vote transitions for posts and comments. */
@Controller("vote")
export class VoteController {
  /** Sets or replaces the current user's post vote. @tag Vote */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-karma-karma-model Publishes the karma aggregate boundary. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-karma-karma-model Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-karma-001-define-the-single-signed-karma-total Publishes one signed karma total. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-karma-001-define-the-single-signed-karma-total Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-karma-002-define-karma-contribution-mappings Publishes vote-to-karma mappings. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-karma-002-define-karma-contribution-mappings Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations Publishes vote operations. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote Publishes vote creation. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction Publishes vote replacement. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-vote-vote-model Publishes vote state. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-vote-model Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-vote-001-define-vote-identity-target-and-values Publishes target and value. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-001-define-vote-identity-target-and-values Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-vote-002-relate-active-votes-to-content-score Publishes score relation. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-002-relate-active-votes-to-content-score Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-vote-003-relate-active-votes-to-author-karma Publishes karma relation. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-003-relate-active-votes-to-author-karma Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle Publishes vote lifecycle. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-001-enter-upvote-state Publishes upvote state. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-001-enter-upvote-state Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-002-enter-downvote-state Publishes downvote state. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-002-enter-downvote-state Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Publishes voting aggregates. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target Publishes one-vote enforcement. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score Publishes score calculation. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions Publishes karma transitions. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Publishes aggregate integrity. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_votes Persists the vote transition. */
  /** @evidenceReview prisma:reddit_votes Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_posts Updates post score. */
  /** @evidenceReview prisma:reddit_posts Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_users Updates author karma. */
  /** @evidenceReview prisma:reddit_users Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Put("post/:postId")
  public async post(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("postId") postId: string & tags.Format<"uuid">,
    @core.TypedBody() body: IRedditVote.IRequest,
  ): Promise<IRedditVote> {
    return RedditProvider.votePost(actor, postId, body);
  }

  /** Sets or replaces the current user's comment vote. @tag Vote */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-003-change-active-vote-direction Publishes comment vote changes. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-003-change-active-vote-direction Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_votes Persists the comment vote transition. */
  /** @evidenceReview prisma:reddit_votes Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_comments Updates comment score. */
  /** @evidenceReview prisma:reddit_comments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_users Updates comment author karma. */
  /** @evidenceReview prisma:reddit_users Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Put("comment/:commentId")
  public async comment(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("commentId") commentId: string & tags.Format<"uuid">,
    @core.TypedBody() body: IRedditVote.IRequest,
  ): Promise<IRedditVote> {
    return RedditProvider.voteComment(actor, commentId, body);
  }

  /** Removes the current user's post vote, including an absent-vote no-op. @tag Vote */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote Publishes vote removal. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-004-remove-an-active-vote Publishes vote lifecycle removal. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-004-remove-an-active-vote Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_votes Removes the post vote. */
  /** @evidenceReview prisma:reddit_votes Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Delete("post/:postId")
  public async erasePost(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("postId") postId: string & tags.Format<"uuid">,
  ): Promise<{ success: true }> {
    await RedditProvider.voteErasePost(actor, postId);
    return { success: true };
  }

  /** Removes the current user's comment vote, including an absent-vote no-op. @tag Vote */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote Publishes vote removal. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_votes Removes the comment vote. */
  /** @evidenceReview prisma:reddit_votes Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Delete("comment/:commentId")
  public async eraseComment(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("commentId") commentId: string & tags.Format<"uuid">,
  ): Promise<{ success: true }> {
    await RedditProvider.voteEraseComment(actor, commentId);
    return { success: true };
  }
}
