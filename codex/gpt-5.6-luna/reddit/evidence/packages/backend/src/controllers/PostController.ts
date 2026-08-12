import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { tags } from "typia";
import type { IRedditPost } from "@benchmark/reddit-api";
import { RedditAuth } from "../decorators/RedditAuth";
import { RedditProvider } from "../providers/RedditProvider";

/** Publishes post creation, public reading, author editing, and author deletion. */
@Controller("post")
export class PostController {
  /** Creates one post for a subscribed, unbanned author. @tag Post */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations Publishes post operations. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-post-operations Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-post-001-create-a-post Publishes post creation. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-001-create-a-post Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-post-post-content-rules Publishes post content rules. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-post-content-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-post-001-validate-required-title-and-exact-post-payload Publishes exact payload validation. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-001-validate-required-title-and-exact-post-payload Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-post-002-validate-link-and-image-payloads Publishes link and image validation. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-002-validate-link-and-image-payloads Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation Publishes subscription eligibility. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting Publishes ban refusal. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules Publishes image payload rules. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules Compared the controller with image validation, thumbnail derivation, and the image-post journey; verified accepted media is persisted and exposed through the post contract. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-media-001-validate-uploaded-image-format-and-size Publishes image validation. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-media-001-validate-uploaded-image-format-and-size Compared the controller with structural image decoding checks and the live upload journey; verified malformed, mismatched, and oversized media are refused before persistence. */
  /** @evidence prisma:reddit_posts Persists post content and aggregates. */
  /** @evidenceReview prisma:reddit_posts Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_users Reads the author. */
  /** @evidenceReview prisma:reddit_users Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_communities Reads community eligibility. */
  /** @evidenceReview prisma:reddit_communities Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_subscriptions Reads subscription eligibility. */
  /** @evidenceReview prisma:reddit_subscriptions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_bans Reads ban eligibility. */
  /** @evidenceReview prisma:reddit_bans Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Post("community/:communityId")
  public async create(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
    @core.TypedBody() body: IRedditPost.ICreate,
  ): Promise<IRedditPost> {
    return RedditProvider.postCreate(actor, communityId, body);
  }

  /** Opens one available post publicly. @tag Post */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-post-002-view-a-single-post Publishes post reading. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-002-view-a-single-post Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-post-post-model Publishes the post model. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-post-model Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-post-001-define-post-identity-and-relationships Publishes post identity and relations. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-001-define-post-identity-and-relationships Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-post-002-define-post-types-and-payloads Publishes typed payloads. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-002-define-post-types-and-payloads Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-post-003-define-post-participation-measures Publishes score and comment count. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-003-define-post-participation-measures Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation Publishes full post presentation. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access Publishes public viewing. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-media-002-present-uploaded-images-and-post-thumbnails Publishes media presentation. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-media-002-present-uploaded-images-and-post-thumbnails Compared the post detail/card projections with thumbnail derivation and the image-card assertion; verified full image and bounded preview presentation remain distinct. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Publishes visible aggregates. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability Publishes comment count. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Publishes deletion-consistent reads. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Publishes public content. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_posts Reads post detail. */
  /** @evidenceReview prisma:reddit_posts Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_comments Reads available comments. */
  /** @evidenceReview prisma:reddit_comments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Get(":id")
  public async at(
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IRedditPost> {
    return RedditProvider.postAt(id);
  }

  /** Edits only the current author's title and same-type payload. @tag Post */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-post-003-edit-an-authored-post Publishes authored post editing. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-003-edit-an-authored-post Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-post-life-001-preserve-post-identity-during-editing Preserves post identity. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-life-001-preserve-post-identity-during-editing Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-post-003-restrict-post-editing-to-title-and-same-type-content Publishes edit restrictions. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-003-restrict-post-editing-to-title-and-same-type-content Compared partial post-update handling with the same-type edit journey; verified omitted payloads remain unchanged and type changes are refused. */
  /** @evidence prisma:reddit_posts Updates authored post fields. */
  /** @evidenceReview prisma:reddit_posts Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Put(":id")
  public async update(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() body: IRedditPost.IUpdate,
  ): Promise<IRedditPost> {
    return RedditProvider.postUpdate(actor, id, body);
  }

  /** Permanently deletes the current author's post and dependent participation. @tag Post */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle Publishes post lifecycle transitions. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-post-004-delete-an-authored-post Publishes authored post deletion. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-004-delete-an-authored-post Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-post-life-002-delete-a-post-and-dependent-participation Publishes dependent deletion. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-life-002-delete-a-post-and-dependent-participation Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted Reverses deleted-content aggregates. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_posts Deletes post state. */
  /** @evidenceReview prisma:reddit_posts Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_comments Deletes dependent comment state. */
  /** @evidenceReview prisma:reddit_comments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_votes Reverses dependent votes. */
  /** @evidenceReview prisma:reddit_votes Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Delete(":id")
  public async erase(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<{ success: true }> {
    await RedditProvider.postErase(actor, id);
    return { success: true };
  }
}
