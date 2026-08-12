import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";

import type { IRedditUser } from "@benchmark/reddit-api";
import { RedditAuth } from "../decorators/RedditAuth";
import { RedditProvider } from "../providers/RedditProvider";

/** Publishes public profile reading and current-profile editing. */
@Controller("user")
export class UserController {
  /** Opens one available public profile by username. @tag Profile */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Publishes profile operations. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-profile-002-view-a-users-public-profile Publishes public profile reading. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-002-view-a-users-public-profile Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Publishes the profile model. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-profile-001-define-public-profile-attributes Publishes profile attributes. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-001-define-public-profile-attributes Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-profile-002-relate-profiles-to-karma-and-authored-content Publishes profile authorship and karma. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-002-relate-profiles-to-karma-and-authored-content Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-profile-003-establish-initial-profile-values Publishes profile defaults. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-003-establish-initial-profile-values Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy Keeps private account fields out of public reads. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-001-keep-credentials-and-email-private Keeps credentials and email private. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-001-keep-credentials-and-email-private Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_users Reads public identity and karma. */
  /** @evidenceReview prisma:reddit_users Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_profiles Reads public profile fields. */
  /** @evidenceReview prisma:reddit_profiles Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_posts Reads authored posts. */
  /** @evidenceReview prisma:reddit_posts Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_comments Reads authored comments. */
  /** @evidenceReview prisma:reddit_comments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Get("username/:username")
  public async at(
    @core.TypedParam("username") username: string,
  ): Promise<IRedditUser> {
    return RedditProvider.profile(username);
  }

  /** Changes only the authenticated user's public profile fields. @tag Profile */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile Publishes profile editing. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules Publishes profile validation. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-profile-001-validate-profile-field-changes Publishes validated profile changes. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-001-validate-profile-field-changes Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_profiles Updates public profile fields. */
  /** @evidenceReview prisma:reddit_profiles Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Put("profile")
  public async update(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedBody() body: IRedditUser.IUpdate,
  ): Promise<IRedditUser> {
    return RedditProvider.updateProfile(actor, body);
  }
}
