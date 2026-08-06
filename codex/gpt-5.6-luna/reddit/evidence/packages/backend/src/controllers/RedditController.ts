import * as core from "@nestia/core";
import { Controller, Get, Headers, Patch, Post, Put } from "@nestjs/common";
import type { IAuth, IBan, IComment, ICommunity, IPage, IPost, IProfile, IReport, ISubscription, IVote } from "@benchmark/reddit2-api";
import { AuthUtil } from "../utils/AuthUtil";
import { RedditProvider } from "../providers/RedditProvider";

/** Publishes profile, community, content, feed, and moderation operations. */
@Controller()
export class RedditController {
 /**
  * @evidence prisma:profiles Persists and reads the profiles state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model The public profile operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-profile-001-define-public-profile-attributes The public profile operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-profile-002-relate-profiles-to-karma-and-authored-content The public profile operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations The public profile operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-002-view-a-users-public-profile The public profile operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content The public profile operation implements this requirement.
 */
  @Get("profile/view/:username")
   public async profile(@core.TypedParam("username") username: string): Promise<IProfile> { return RedditProvider.profileAt({ username, posts: { limit: 25 }, comments: { limit: 25 } }); }
 /**
  * @evidence prisma:profiles Persists and reads the profiles state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model The public profileUpdate operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-profile-001-define-public-profile-attributes The public profileUpdate operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations The public profileUpdate operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile The public profileUpdate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules The public profileUpdate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-profile-001-validate-profile-field-changes The public profileUpdate operation implements this requirement.
 */
  @Put("profile/edit")
   public async profileUpdate(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: IProfile.IUpdate): Promise<IProfile> { return RedditProvider.profileUpdate({ actor: await AuthUtil.authorize(authorization), body }); }
 /**
  * @evidence prisma:communities Persists and reads the communities state required by this operation.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority The public communityCreate operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-001-bootstrap-community-owner-and-subscriber The public communityCreate operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-community-community-model The public communityCreate operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-community-001-define-community-attributes The public communityCreate operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-community-002-relate-a-community-to-its-owner The public communityCreate operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-community-003-relate-communities-to-subscribers The public communityCreate operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-community-004-relate-communities-to-content-and-moderation The public communityCreate operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-community-community-operations The public communityCreate operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community The public communityCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules The public communityCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-community-001-validate-community-creation-fields-and-unique-name The public communityCreate operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent The public communityCreate operation implements this requirement.
 */

  @Post("community/create")
   public async communityCreate(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: ICommunity.ICreate): Promise<ICommunity> { return RedditProvider.communityCreate({ actor: await AuthUtil.authorize(authorization), body }); }
 /**
  * @evidence prisma:communities Persists and reads the communities state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-community-community-model The public communityIndex operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-community-001-define-community-attributes The public communityIndex operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-community-community-operations The public communityIndex operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-community-002-browse-all-communities The public communityIndex operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-community-003-search-communities-by-name The public communityIndex operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules The public communityIndex operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-community-002-match-and-order-community-name-search The public communityIndex operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules The public communityIndex operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size The public communityIndex operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state The public communityIndex operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity The public communityIndex operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation The public communityIndex operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation The public communityIndex operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content The public communityIndex operation implements this requirement.
 */
  @Patch("community/list")
   public async communityIndex(@core.TypedBody() input: ICommunity.IRequest): Promise<IPage<ICommunity>> { return RedditProvider.communities({ input }); }
 /**
  * @evidence prisma:communities Persists and reads the communities state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-community-community-model The public communityAt operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-community-001-define-community-attributes The public communityAt operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-community-community-operations The public communityAt operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content The public communityAt operation implements this requirement.
 */
  @Get("community/detail/:communityId")
   public async communityAt(@core.TypedParam("communityId") communityId: string): Promise<ICommunity> { return RedditProvider.communityAt(communityId); }
 /**
  * @evidence prisma:subscriptions Persists and reads the subscriptions state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle The public subscribe operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-001-establish-active-subscription-state The public subscribe operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations The public subscribe operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-001-subscribe-to-a-community The public subscribe operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent The public subscribe operation implements this requirement.
 */
  @Post("community/subscribe/:communityId/execute")
   public async subscribe(@Headers("authorization") authorization: string | undefined, @core.TypedParam("communityId") communityId: string): Promise<ICommunity> { return RedditProvider.subscribe({ actor: await AuthUtil.authorize(authorization), communityId }); }
 /**
  * @evidence prisma:subscriptions Persists and reads the subscriptions state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle The public unsubscribe operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-002-end-active-subscription-state The public unsubscribe operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations The public unsubscribe operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-002-unsubscribe-from-a-community The public unsubscribe operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent The public unsubscribe operation implements this requirement.
 */
  @Post("community/unsubscribe/:communityId/execute")
   public async unsubscribe(@Headers("authorization") authorization: string | undefined, @core.TypedParam("communityId") communityId: string): Promise<boolean> { await RedditProvider.unsubscribe({ actor: await AuthUtil.authorize(authorization), communityId }); return true; }
 /**
  * @evidence prisma:subscriptions Persists and reads the subscriptions state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle The public subscriptions operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations The public subscriptions operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-003-list-the-current-users-subscriptions The public subscriptions operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules The public subscriptions operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size The public subscriptions operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state The public subscriptions operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent The public subscriptions operation implements this requirement.
 */
  @Patch("subscription/list")
   public async subscriptions(@Headers("authorization") authorization: string | undefined, @core.TypedBody() input: IPage.IRequest): Promise<IPage<ISubscription>> { return RedditProvider.subscriptions({ actor: await AuthUtil.authorize(authorization), input }); }
 /**
  * @evidence prisma:posts Persists and reads the posts state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-post-model The public postCreate operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-001-define-post-identity-and-relationships The public postCreate operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-002-define-post-types-and-payloads The public postCreate operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-003-define-post-participation-measures The public postCreate operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation The public postCreate operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations The public postCreate operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-post-001-create-a-post The public postCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-post-post-content-rules The public postCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-post-001-validate-required-title-and-exact-post-payload The public postCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-post-002-validate-link-and-image-payloads The public postCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules The public postCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation The public postCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting The public postCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules The public postCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-media-001-validate-uploaded-image-format-and-size The public postCreate operation implements this requirement.
 */

  @Post("post/create/:communityId")
   public async postCreate(@Headers("authorization") authorization: string | undefined, @core.TypedParam("communityId") communityId: string, @core.TypedBody() body: IPost.ICreate): Promise<IPost> { return RedditProvider.postCreate({ actor: await AuthUtil.authorize(authorization), communityId, body }); }
 /**
  * @evidence prisma:posts Persists and reads the posts state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-post-model The public postAt operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-001-define-post-identity-and-relationships The public postAt operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-002-define-post-types-and-payloads The public postAt operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-003-define-post-participation-measures The public postAt operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation The public postAt operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations The public postAt operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-post-002-view-a-single-post The public postAt operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access The public postAt operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content The public postAt operation implements this requirement.
 */
  @Get("post/detail/:id")
   public async postAt(@core.TypedParam("id") id: string): Promise<IPost> { return RedditProvider.postAt({ id }); }
 /**
  * @evidence prisma:posts Persists and reads the posts state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle The public postUpdate operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-001-preserve-post-identity-during-editing The public postUpdate operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations The public postUpdate operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-post-003-edit-an-authored-post The public postUpdate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-post-post-content-rules The public postUpdate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-post-003-restrict-post-editing-to-title-and-same-type-content The public postUpdate operation implements this requirement.
 */
  @Put("post/update/:id")
   public async postUpdate(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: IPost.IUpdate): Promise<IPost> { return RedditProvider.postUpdate({ actor: await AuthUtil.authorize(authorization), id, body }); }
 /**
  * @evidence prisma:posts Persists and reads the posts state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle The public postErase operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-002-delete-a-post-and-dependent-participation The public postErase operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations The public postErase operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-post-004-delete-an-authored-post The public postErase operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted The public postErase operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views The public postErase operation implements this requirement.
 */
  @Post("post/:id/erase")
   public async postErase(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<boolean> { await RedditProvider.postErase({ actor: await AuthUtil.authorize(authorization), id }); return true; }
 /**
  * @evidence prisma:posts Persists and reads the posts state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle The public postModerateErase operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-002-delete-a-post-and-dependent-participation The public postModerateErase operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations The public postModerateErase operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-post-005-delete-a-community-post-as-moderator The public postModerateErase operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The public postModerateErase operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted The public postModerateErase operation implements this requirement.
 */
  @Post("community/:communityId/post/:id/erase")
   public async postModerateErase(@Headers("authorization") authorization: string | undefined, @core.TypedParam("communityId") _communityId: string, @core.TypedParam("id") id: string): Promise<boolean> { await RedditProvider.postErase({ actor: await AuthUtil.authorize(authorization), id, moderator: true }); return true; }
 /**
  * @evidence prisma:posts Persists and reads the posts state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-002-view-the-public-popular-feed The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-001-order-feeds-by-new The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-002-order-feeds-by-top-and-selected-time-range The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-003-order-feeds-by-hot The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-004-order-feeds-by-controversial The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-005-apply-deterministic-pagination-boundaries The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation The public feedPopular operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content The public feedPopular operation implements this requirement.
 */

  @Patch("feed/popular")
   public async feedPopular(@core.TypedBody() input: IPost.IRequest): Promise<IPage<IPost.ISummary>> { return RedditProvider.feed({ input }); }
 /**
  * @evidence prisma:posts Persists and reads the posts state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation The public feedHome operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys The public feedHome operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-001-view-the-authenticated-home-feed The public feedHome operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range The public feedHome operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results The public feedHome operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards The public feedHome operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules The public feedHome operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-001-order-feeds-by-new The public feedHome operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-002-order-feeds-by-top-and-selected-time-range The public feedHome operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-003-order-feeds-by-hot The public feedHome operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-004-order-feeds-by-controversial The public feedHome operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-005-apply-deterministic-pagination-boundaries The public feedHome operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules The public feedHome operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size The public feedHome operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state The public feedHome operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity The public feedHome operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation The public feedHome operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation The public feedHome operation implements this requirement.
 */
  @Patch("user/feed/home")
   public async feedHome(@Headers("authorization") authorization: string | undefined, @core.TypedBody() input: IPost.IRequest): Promise<IPage<IPost.ISummary>> { return RedditProvider.feed({ actor: await AuthUtil.authorize(authorization), input }); }
 /**
  * @evidence prisma:posts Persists and reads the posts state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-003-view-a-public-community-feed The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-001-order-feeds-by-new The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-002-order-feeds-by-top-and-selected-time-range The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-003-order-feeds-by-hot The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-004-order-feeds-by-controversial The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-feed-005-apply-deterministic-pagination-boundaries The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state The public feedCommunity operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content The public feedCommunity operation implements this requirement.
 */
  @Patch("community/:communityId/feed")
   public async feedCommunity(@core.TypedParam("communityId") communityId: string, @core.TypedBody() input: IPost.IRequest): Promise<IPage<IPost.ISummary>> { return RedditProvider.feed({ communityId, input }); }
 /**
  * @evidence prisma:votes Persists and reads the votes state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-vote-model The public postVote operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-001-define-vote-identity-target-and-values The public postVote operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-002-relate-active-votes-to-content-score The public postVote operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-003-relate-active-votes-to-author-karma The public postVote operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-001-enter-upvote-state The public postVote operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-002-enter-downvote-state The public postVote operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-003-change-active-vote-direction The public postVote operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations The public postVote operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote The public postVote operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction The public postVote operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules The public postVote operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target The public postVote operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score The public postVote operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions The public postVote operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent The public postVote operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-karma-karma-model The vote operation updates the author karma aggregate.
  * @evidence docs/analysis/02-domain-model.md#req-dom-karma-001-define-the-single-signed-karma-total The vote operation updates the signed karma total.
  * @evidence docs/analysis/02-domain-model.md#req-dom-karma-002-define-karma-contribution-mappings The vote operation applies the vote-to-karma mapping.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity The vote operation keeps visible score and karma aggregates consistent.
 */

  @Post("post/:id/vote")
   public async postVote(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: IVote.IRequest): Promise<IVote> { return RedditProvider.vote({ actor: await AuthUtil.authorize(authorization), targetId: id, target: "post", value: body.value }); }
 /**
  * @evidence prisma:votes Persists and reads the votes state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-vote-model The public postVoteRemove operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-004-remove-an-active-vote The public postVoteRemove operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations The public postVoteRemove operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote The public postVoteRemove operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules The public postVoteRemove operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target The public postVoteRemove operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score The public postVoteRemove operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions The public postVoteRemove operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent The public postVoteRemove operation implements this requirement.
 */
  @Post("post/:id/vote/remove")
   public async postVoteRemove(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<IVote> { return RedditProvider.voteRemove({ actor: await AuthUtil.authorize(authorization), targetId: id, target: "post" }); }
 /**
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-vote-model Implements the REQ-DOM-VOTE behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-001-define-vote-identity-target-and-values Implements the REQ-DOM-VOTE-001 behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-002-relate-active-votes-to-content-score Implements the REQ-DOM-VOTE-002 behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-003-relate-active-votes-to-author-karma Implements the REQ-DOM-VOTE-003 behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle Implements the REQ-DOM-VOTE-LIFE behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-001-enter-upvote-state Implements the REQ-DOM-VOTE-LIFE-001 behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-002-enter-downvote-state Implements the REQ-DOM-VOTE-LIFE-002 behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-003-change-active-vote-direction Implements the REQ-DOM-VOTE-LIFE-003 behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-004-remove-an-active-vote Implements the REQ-DOM-VOTE-LIFE-004 behavior at the public boundary.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations Implements the REQ-FUNC-VOTE behavior at the public boundary.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote Implements the REQ-FUNC-VOTE-001 behavior at the public boundary.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction Implements the REQ-FUNC-VOTE-002 behavior at the public boundary.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote Implements the REQ-FUNC-VOTE-003 behavior at the public boundary.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Implements the REQ-RULE-VOTE behavior at the public boundary.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target Implements the REQ-RULE-VOTE-001 behavior at the public boundary.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score Implements the REQ-RULE-VOTE-002 behavior at the public boundary.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions Implements the REQ-RULE-VOTE-003 behavior at the public boundary.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted Implements the REQ-RULE-VOTE-004 behavior at the public boundary.
  * @evidence prisma:votes Persists and reads the votes state required by this operation.
  */
  @Post("comment/:id/vote")
   public async commentVote(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: IVote.IRequest): Promise<IVote> { return RedditProvider.vote({ actor: await AuthUtil.authorize(authorization), targetId: id, target: "comment", value: body.value }); }
 /**
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-vote-model Implements the REQ-DOM-VOTE behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-001-define-vote-identity-target-and-values Implements the REQ-DOM-VOTE-001 behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-002-relate-active-votes-to-content-score Implements the REQ-DOM-VOTE-002 behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-003-relate-active-votes-to-author-karma Implements the REQ-DOM-VOTE-003 behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle Implements the REQ-DOM-VOTE-LIFE behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-001-enter-upvote-state Implements the REQ-DOM-VOTE-LIFE-001 behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-002-enter-downvote-state Implements the REQ-DOM-VOTE-LIFE-002 behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-003-change-active-vote-direction Implements the REQ-DOM-VOTE-LIFE-003 behavior at the public boundary.
  * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-004-remove-an-active-vote Implements the REQ-DOM-VOTE-LIFE-004 behavior at the public boundary.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations Implements the REQ-FUNC-VOTE behavior at the public boundary.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote Implements the REQ-FUNC-VOTE-001 behavior at the public boundary.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction Implements the REQ-FUNC-VOTE-002 behavior at the public boundary.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote Implements the REQ-FUNC-VOTE-003 behavior at the public boundary.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Implements the REQ-RULE-VOTE behavior at the public boundary.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target Implements the REQ-RULE-VOTE-001 behavior at the public boundary.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score Implements the REQ-RULE-VOTE-002 behavior at the public boundary.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions Implements the REQ-RULE-VOTE-003 behavior at the public boundary.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted Implements the REQ-RULE-VOTE-004 behavior at the public boundary.
  * @evidence prisma:votes Persists and reads the votes state required by this operation.
  */
  @Post("comment/:id/vote/remove")
   public async commentVoteRemove(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<IVote> { return RedditProvider.voteRemove({ actor: await AuthUtil.authorize(authorization), targetId: id, target: "comment" }); }
 /**
  * @evidence prisma:comments Persists and reads the comments state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-comment-comment-model The public commentCreate operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-comment-001-define-comment-identity-and-display The public commentCreate operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-comment-002-relate-comments-through-unbounded-nesting The public commentCreate operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations The public commentCreate operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-001-write-a-top-level-comment The public commentCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules The public commentCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-comment-001-validate-same-post-acyclic-reply-relationships The public commentCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-comment-002-allow-unlimited-reply-depth The public commentCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment The public commentCreate operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting The public commentCreate operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability The public commentCreate operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure The public commentCreate operation implements this requirement.
 */

  @Post("post/:postId/comment")
   public async commentCreate(@Headers("authorization") authorization: string | undefined, @core.TypedParam("postId") postId: string, @core.TypedBody() body: IComment.ICreate): Promise<IComment> { return RedditProvider.commentCreate({ actor: await AuthUtil.authorize(authorization), postId, body }); }
 /**
  * @evidence prisma:comments Persists and reads the comments state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-comment-comment-model The public commentReply operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-comment-002-relate-comments-through-unbounded-nesting The public commentReply operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations The public commentReply operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-002-reply-to-a-comment The public commentReply operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules The public commentReply operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-comment-001-validate-same-post-acyclic-reply-relationships The public commentReply operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-comment-002-allow-unlimited-reply-depth The public commentReply operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment The public commentReply operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting The public commentReply operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability The public commentReply operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure The public commentReply operation implements this requirement.
 */
  @Post("comment/:commentId/reply")
   public async commentReply(@Headers("authorization") authorization: string | undefined, @core.TypedParam("commentId") commentId: string, @core.TypedBody() body: IComment.ICreate): Promise<IComment> { return RedditProvider.commentReply({ actor: await AuthUtil.authorize(authorization), parentId: commentId, body }); }
 /**
  * @evidence prisma:comments Persists and reads the comments state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-comment-comment-model The public commentIndex operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-comment-001-define-comment-identity-and-display The public commentIndex operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-comment-002-relate-comments-through-unbounded-nesting The public commentIndex operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations The public commentIndex operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-003-view-a-nested-comment-thread The public commentIndex operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-004-sort-comments-on-a-post The public commentIndex operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules The public commentIndex operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-comment-003-order-comments-by-best The public commentIndex operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-comment-004-order-comments-by-new The public commentIndex operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-comment-005-order-comments-by-controversial The public commentIndex operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules The public commentIndex operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size The public commentIndex operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state The public commentIndex operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure The public commentIndex operation implements this requirement.
 */
  @Patch("post/:postId/comments")
   public async commentIndex(@core.TypedParam("postId") postId: string, @core.TypedBody() input: IComment.IRequest): Promise<IPage<IComment>> { return RedditProvider.comments({ postId, input }); }
 /**
  * @evidence prisma:comments Persists and reads the comments state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle The public commentUpdate operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-001-preserve-comment-identity-during-editing The public commentUpdate operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations The public commentUpdate operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-005-edit-an-authored-comment The public commentUpdate operation implements this requirement.
 */
  @Put("comment/:id")
   public async commentUpdate(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string, @core.TypedBody() body: IComment.IUpdate): Promise<IComment> { return RedditProvider.commentUpdate({ actor: await AuthUtil.authorize(authorization), id, body }); }
 /**
  * @evidence prisma:comments Persists and reads the comments state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle The public commentErase operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-002-delete-comment-content-and-preserve-replies The public commentErase operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations The public commentErase operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-006-delete-an-authored-comment The public commentErase operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted The public commentErase operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability The public commentErase operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure The public commentErase operation implements this requirement.
 */
  @Post("comment/:id/erase")
   public async commentErase(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<boolean> { await RedditProvider.commentErase({ actor: await AuthUtil.authorize(authorization), id }); return true; }
 /**
  * @evidence prisma:comments Persists and reads the comments state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle The public commentModerateErase operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-002-delete-comment-content-and-preserve-replies The public commentModerateErase operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations The public commentModerateErase operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-007-delete-a-community-comment-as-moderator The public commentModerateErase operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The public commentModerateErase operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted The public commentModerateErase operation implements this requirement.
 */
  @Post("community/:communityId/comment/:id/erase")
   public async commentModerateErase(@Headers("authorization") authorization: string | undefined, @core.TypedParam("communityId") _communityId: string, @core.TypedParam("id") id: string): Promise<boolean> { await RedditProvider.commentErase({ actor: await AuthUtil.authorize(authorization), id, moderator: true }); return true; }
 /**
  * @evidence prisma:moderators Persists and reads the moderators state required by this operation.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority The public moderatorAdd operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-002-owner-appointment-of-moderators The public moderatorAdd operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-003-moderator-appointment-of-peers The public moderatorAdd operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations The public moderatorAdd operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner The public moderatorAdd operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-role-002-add-a-moderator-as-community-moderator The public moderatorAdd operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules The public moderatorAdd operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The public moderatorAdd operation implements this requirement.
 */

  @Post("moderator/add/:communityId/:userId")
   public async moderatorAdd(@Headers("authorization") authorization: string | undefined, @core.TypedParam("communityId") communityId: string, @core.TypedParam("userId") userId: string): Promise<boolean> { await RedditProvider.moderatorAdd({ actor: await AuthUtil.authorize(authorization), communityId, userId }); return true; }
 /**
  * @evidence prisma:moderators Persists and reads the moderators state required by this operation.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority The public moderatorRemove operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-004-owner-removal-of-moderators The public moderatorRemove operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-005-protect-owner-and-moderator-assignments The public moderatorRemove operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations The public moderatorRemove operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-role-003-remove-a-moderator-as-community-owner The public moderatorRemove operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules The public moderatorRemove operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The public moderatorRemove operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-002-protect-owner-and-moderator-assignments-from-moderator-removal The public moderatorRemove operation implements this requirement.
 */
  @Post("moderator/remove/:communityId/:userId")
   public async moderatorRemove(@Headers("authorization") authorization: string | undefined, @core.TypedParam("communityId") communityId: string, @core.TypedParam("userId") userId: string): Promise<boolean> { await RedditProvider.moderatorRemove({ actor: await AuthUtil.authorize(authorization), communityId, userId }); return true; }
 /**
  * @evidence prisma:bans Persists and reads the bans state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle The public ban operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-ban-001-enter-active-ban-state The public ban operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations The public ban operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-001-ban-a-user-from-a-community The public ban operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The public ban operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-003-protect-the-owner-from-community-bans The public ban operation implements this requirement.
 */
  @Post("ban/create/:communityId/:userId")
   public async ban(@Headers("authorization") authorization: string | undefined, @core.TypedParam("communityId") communityId: string, @core.TypedParam("userId") userId: string): Promise<boolean> { await RedditProvider.ban({ actor: await AuthUtil.authorize(authorization), communityId, userId }); return true; }
 /**
  * @evidence prisma:bans Persists and reads the bans state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle The public unban operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-ban-002-end-active-ban-state The public unban operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-ban-003-retain-resolved-ban-history The public unban operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations The public unban operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-002-unban-a-user-from-a-community The public unban operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The public unban operation implements this requirement.
 */
  @Post("ban/remove/:communityId/:userId")
   public async unban(@Headers("authorization") authorization: string | undefined, @core.TypedParam("communityId") communityId: string, @core.TypedParam("userId") userId: string): Promise<boolean> { await RedditProvider.unban({ actor: await AuthUtil.authorize(authorization), communityId, userId }); return true; }
 /**
  * @evidence prisma:bans Persists and reads the bans state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle The public bans operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-ban-003-retain-resolved-ban-history The public bans operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations The public bans operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-003-view-a-communitys-banned-users The public bans operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The public bans operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private The public bans operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules The public bans operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size The public bans operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state The public bans operation implements this requirement.
 */
  @Patch("ban/list/:communityId")
   public async bans(@Headers("authorization") authorization: string | undefined, @core.TypedParam("communityId") communityId: string, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IBan>> { return RedditProvider.bans({ actor: await AuthUtil.authorize(authorization), communityId, input }); }
 /**
  * @evidence prisma:reports Persists and reads the reports state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-content-report-model The public postReport operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-001-define-report-target-reporter-and-reason The public postReport operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-002-relate-unresolved-reports-to-a-community-queue The public postReport operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-003-prevent-duplicate-unresolved-reports The public postReport operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-001-enter-unresolved-report-state The public postReport operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution The public postReport operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-report-001-submit-a-post-or-comment-report The public postReport operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules The public postReport operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-report-001-require-a-valid-report-target-and-reason The public postReport operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-report-002-refuse-duplicate-unresolved-reports The public postReport operation implements this requirement.
 */

  @Post("post/:postId/report")
   public async postReport(@Headers("authorization") authorization: string | undefined, @core.TypedParam("postId") postId: string, @core.TypedBody() body: IReport.ICreate): Promise<IReport> { return RedditProvider.reportCreate({ actor: await AuthUtil.authorize(authorization), targetId: postId, target: "post", body }); }
 /**
  * @evidence prisma:reports Persists and reads the reports state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-content-report-model The public commentReport operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-001-define-report-target-reporter-and-reason The public commentReport operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-002-relate-unresolved-reports-to-a-community-queue The public commentReport operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-003-prevent-duplicate-unresolved-reports The public commentReport operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-001-enter-unresolved-report-state The public commentReport operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution The public commentReport operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-report-001-submit-a-post-or-comment-report The public commentReport operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules The public commentReport operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-report-001-require-a-valid-report-target-and-reason The public commentReport operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-report-002-refuse-duplicate-unresolved-reports The public commentReport operation implements this requirement.
 */
  @Post("comment/:commentId/report")
   public async commentReport(@Headers("authorization") authorization: string | undefined, @core.TypedParam("commentId") commentId: string, @core.TypedBody() body: IReport.ICreate): Promise<IReport> { return RedditProvider.reportCreate({ actor: await AuthUtil.authorize(authorization), targetId: commentId, target: "comment", body }); }
 /**
  * @evidence prisma:reports Persists and reads the reports state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-content-report-model The public reports operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-002-relate-unresolved-reports-to-a-community-queue The public reports operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution The public reports operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports The public reports operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules The public reports operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution The public reports operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The public reports operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private The public reports operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules The public reports operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size The public reports operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state The public reports operation implements this requirement.
 */
  @Patch("report/list/:communityId")
   public async reports(@Headers("authorization") authorization: string | undefined, @core.TypedParam("communityId") communityId: string, @core.TypedBody() input: IPage.IRequest): Promise<IPage<IReport>> { return RedditProvider.reports({ actor: await AuthUtil.authorize(authorization), communityId, input }); }
 /**
  * @evidence prisma:reports Persists and reads the reports state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle The public reportApprove operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-002-approve-a-report-and-delete-its-target The public reportApprove operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-004-retain-resolved-moderation-history The public reportApprove operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution The public reportApprove operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-report-003-approve-a-report The public reportApprove operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules The public reportApprove operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution The public reportApprove operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution The public reportApprove operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The public reportApprove operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views The public reportApprove operation implements this requirement.
 */
  @Post("report/:id/approve")
   public async reportApprove(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<boolean> { await RedditProvider.reportResolve({ actor: await AuthUtil.authorize(authorization), id, approve: true }); return true; }
 /**
  * @evidence prisma:reports Persists and reads the reports state required by this operation.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle The public reportDismiss operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-003-dismiss-a-report-and-retain-its-target The public reportDismiss operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-004-retain-resolved-moderation-history The public reportDismiss operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution The public reportDismiss operation implements this requirement.
  * @evidence docs/analysis/03-functional-requirements.md#req-func-report-004-dismiss-a-report The public reportDismiss operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules The public reportDismiss operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution The public reportDismiss operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution The public reportDismiss operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The public reportDismiss operation implements this requirement.
 */
  @Post("report/:id/dismiss")
   public async reportDismiss(@Headers("authorization") authorization: string | undefined, @core.TypedParam("id") id: string): Promise<boolean> { await RedditProvider.reportResolve({ actor: await AuthUtil.authorize(authorization), id, approve: false }); return true; }
}


