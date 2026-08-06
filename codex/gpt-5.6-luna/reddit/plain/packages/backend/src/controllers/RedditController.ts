import * as core from "@nestia/core";
import { Controller, Headers, Param } from "@nestjs/common";
import type { IAuth, IAuthorized, IBan, IBanHistory, IComment, ICommunity, IPage, IPost, IProfile, IReport, IReportHistory, ISubscription, UUID, IVote, IVoteRequest, IModerationTarget, IResult } from "@benchmark/reddit-api";
import { redditProvider } from "../providers/RedditProvider";

// Compatibility aliases for previously generated SDK source during regeneration.
export type IVoteBody = IVoteRequest;
export type IModerationTargetBody = IModerationTarget;
export type { IModerationTarget };
/**
 * Public and authenticated Reddit operations.
 *
 * Public reads are explicitly marked in each operation's summary; protected
 * commands derive the actor from the Authorization header and delegate all
 * ownership, visibility, refusal, and persistence rules to the provider.
 *
 * @tag reddit
 */
@Controller("reddit")
export class RedditController {
  /**
   * Register an active account, create its initial profile, and start a session. Invalid fields and reserved identities are refused; the issued access token is retained in Authorization.
   *
   * @param body Account registration payload.
   * @returns The operation result.
   * @tag reddit
   * @setHeader token Authorization
   */
  @core.TypedRoute.Post("auth/user/join") public join(@core.TypedBody() body: IAuth.IJoin): IAuthorized { return redditProvider.join(body); }
  /**
   * Authenticate an active account without changing roles or subscriptions. Unknown, deleted, or wrong credentials receive the same refusal; the new session token is retained in Authorization.
   *
   * @param body Login credentials.
   * @returns The operation result.
   * @tag reddit
   * @setHeader token Authorization
   */
  @core.TypedRoute.Post("auth/user/login") public login(@core.TypedBody() body: IAuth.ILogin): IAuthorized { return redditProvider.login(body); }
  /**
   * Rotate the presented refresh session for the same active account. Missing, revoked, expired, or deleted sessions are refused.
   *
   * @param header Request value used by this operation.
   * @param body Refresh token payload.
   * @returns The operation result.
   * @tag reddit
   * @setHeader token Authorization
   */
  @core.TypedRoute.Post("auth/user/refresh") public refresh(@Headers("authorization") header: string | undefined, @core.TypedBody() body: IAuth.IRefresh): IAuthorized { return redditProvider.refresh(header, body); }
  /**
   * Request a one-time recovery proof with a neutral result for known and unknown emails.
   *
   * @param body Recovery request email.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Post("auth/user/recovery/request") public recoveryRequest(@core.TypedBody() body: IAuth.IRecoveryRequest): IResult { return redditProvider.recoveryRequest(body); }
  /**
   * Consume the latest unexpired recovery proof, replace the password, revoke all sessions, and issue a new session. Invalid proofs are refused.
   *
   * @param body Recovery proof and replacement password.
   * @returns The operation result.
   * @tag reddit
   * @setHeader token Authorization
   */
  @core.TypedRoute.Post("auth/user/recovery/complete") public recoveryComplete(@core.TypedBody() body: IAuth.IRecoveryComplete): IAuthorized { return redditProvider.recoveryComplete(body); }
  /**
   * Revoke only the authenticated session in use; account state and other sessions remain unchanged.
   *
   * @param header Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Post("user/session/logout") public logout(@Headers("authorization") header: string | undefined): IResult { redditProvider.logout(header); return { success: true }; }
  /**
   * Revoke every session for the authenticated account, including the caller's session.
   *
   * @param header Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Post("user/session/revoke-all") public logoutAll(@Headers("authorization") header: string | undefined): IResult { redditProvider.logoutAll(header); return { success: true }; }
  /**
   * Replace the current password after proof, retaining this session and revoking every other session. Wrong or identical passwords are refused.
   *
   * @param header Request value used by this operation.
   * @param body New password payload.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Put("user/password") public changePassword(@Headers("authorization") header: string | undefined, @core.TypedBody() body: IAuth.IChangePassword): IResult { redditProvider.changePassword(header, body); return { success: true }; }
  /**
   * Permanently delete the authenticated account after password proof, cascading authored state, votes, roles, reports, sessions, and ownership succession atomically.
   *
   * @param header Request value used by this operation.
   * @param body Password confirmation payload.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Delete("user/account") public deleteAccount(@Headers("authorization") header: string | undefined, @core.TypedBody() body: IAuth.IDeleteAccount): IResult { return redditProvider.deleteAccount(header, body.password); }
  /**
   * Publicly view one available profile and its current karma and authored pages; deleted or unknown usernames are not found.
   *
   * @param username Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Get("user/profile/:username") public profile(@Param("username") username: string): IProfile { return redditProvider.profile(undefined, username); }
  /**
   * Publicly view a profile with independent post and comment continuations; deleted or unknown usernames are not found.
   *
   * @param username Request value used by this operation.
   * @param body Independent profile page inputs.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Patch("user/profile/:username") public profilePage(@Param("username") username: string, @core.TypedBody() body: IProfile.IRequest): IProfile { return redditProvider.profile(undefined, username, body); }
  /**
   * Edit only the authenticated user's display name, biography, and avatar; invalid or blank supplied values leave the profile unchanged.
   *
   * @param header Request value used by this operation.
   * @param body Profile fields to replace.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Put("user/profile") public updateProfile(@Headers("authorization") header: string | undefined, @core.TypedBody() body: IProfile.IUpdate): IProfile { return redditProvider.updateProfile(header, body); }

  /**
   * Create an active community and bootstrap the caller as owner and subscriber; invalid or conflicting fields create nothing.
   *
   * @param header Request value used by this operation.
   * @param body Community creation fields.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Post("community") public createCommunity(@Headers("authorization") header: string | undefined, @core.TypedBody() body: ICommunity.ICreate): ICommunity { return redditProvider.createCommunity(header, body); }
  /**
   * Publicly browse or name-search active and archived communities in normalized-name order.
   *
   * @param body Community search and pagination inputs.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Patch("community") public listCommunities(@core.TypedBody() body: ICommunity.IRequest): IPage<ICommunity> { return redditProvider.listCommunities(body); }
  /**
   * Publicly read one community's description, lifecycle status, owner, and subscriber count. Unknown identifiers are not found.
   *
   * @param id Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Get("community/:id") public getCommunity(@Param("id") id: UUID): ICommunity { return redditProvider.getCommunity(id); }
  /**
   * Subscribe the authenticated caller to an active community; duplicate subscription is a no-op and archives are refused.
   *
   * @param header Request value used by this operation.
   * @param id Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Post("community/:id/subscription") public subscribe(@Headers("authorization") header: string | undefined, @Param("id") id: UUID): ICommunity { return redditProvider.subscribe(header, id); }
  /**
   * End only the authenticated caller's subscription, including a residual archived subscription.
   *
   * @param header Request value used by this operation.
   * @param id Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Delete("community/:id/subscription") public unsubscribe(@Headers("authorization") header: string | undefined, @Param("id") id: UUID): ICommunity { return redditProvider.unsubscribe(header, id); }
  /**
   * Privately list every current subscription of the authenticated caller, including archived residuals.
   *
   * @param header Request value used by this operation.
   * @param body Pagination inputs.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Patch("user/subscription") public subscriptions(@Headers("authorization") header: string | undefined, @core.TypedBody() body: IPage.IRequest): IPage<ISubscription> { return redditProvider.subscriptions(header, body); }

  /**
   * Create one typed post for a subscribed, unbanned caller in an active community; invalid payloads and eligibility are refused.
   *
   * @param header Request value used by this operation.
   * @param communityId Request value used by this operation.
   * @param body Post creation fields.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Post("community/:communityId/post") public createPost(@Headers("authorization") header: string | undefined, @Param("communityId") communityId: UUID, @core.TypedBody() body: IPost.ICreate): IPost { return redditProvider.createPost(header, communityId, body); }
  /**
   * Publicly read one available post with its complete payload, score, count, author, and community.
   *
   * @param id Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Get("post/:id") public getPost(@Param("id") id: UUID): IPost { return redditProvider.getPost(id); }
  /**
   * Let only the post author edit title and same-type payload in an active community; identity, type, and invalid edits are refused.
   *
   * @param header Request value used by this operation.
   * @param id Request value used by this operation.
   * @param body Post fields to replace.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Put("post/:id") public updatePost(@Headers("authorization") header: string | undefined, @Param("id") id: UUID, @core.TypedBody() body: IPost.IUpdate): IPost { return redditProvider.updatePost(header, id, body); }
  /**
   * Permanently delete the caller's own available post and all dependent comments, votes, reports, and karma contributions.
   *
   * @param header Request value used by this operation.
   * @param id Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Delete("post/:id") public deletePost(@Headers("authorization") header: string | undefined, @Param("id") id: UUID): IResult { redditProvider.deletePost(header, id); return { success: true }; }
  /**
   * Let a current owner or moderator delete any available post in the exact active community scope.
   *
   * @param header Request value used by this operation.
   * @param communityId Request value used by this operation.
   * @param id Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Delete("community/:communityId/post/:id") public moderateDeletePost(@Headers("authorization") header: string | undefined, @Param("communityId") communityId: UUID, @Param("id") id: UUID): IResult { redditProvider.deletePost(header, id, true, communityId); return { success: true }; }
  /**
   * Authenticated home feed restricted to the caller's current subscriptions, including residual archived subscriptions.
   *
   * @param header Request value used by this operation.
   * @param body Feed sorting and pagination inputs.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Patch("feed/home") public homeFeed(@Headers("authorization") header: string | undefined, @core.TypedBody() body: IPost.IRequest): IPage<IPost.ISummary> { return redditProvider.feed(header, "home", undefined, body); }
  /**
   * Public platform-wide feed across active and archived communities with validated sorting and pagination.
   *
   * @param body Feed sorting and pagination inputs.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Patch("feed/popular") public popularFeed(@core.TypedBody() body: IPost.IRequest): IPage<IPost.ISummary> { return redditProvider.feed(undefined, "popular", undefined, body); }
  /**
   * Public feed for one active or archived community; unknown communities are not found.
   *
   * @param communityId Request value used by this operation.
   * @param body Feed sorting and pagination inputs.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Patch("community/:communityId/feed") public communityFeed(@Param("communityId") communityId: UUID, @core.TypedBody() body: IPost.IRequest): IPage<IPost.ISummary> { return redditProvider.feed(undefined, "community", communityId, body); }

  /**
   * Create a nonblank top-level comment or same-post reply for an authenticated, unbanned caller in an active community.
   *
   * @param header Request value used by this operation.
   * @param postId Request value used by this operation.
   * @param body Comment creation fields.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Post("post/:postId/comment") public createComment(@Headers("authorization") header: string | undefined, @Param("postId") postId: UUID, @core.TypedBody() body: IComment.ICreate): IComment { return redditProvider.createComment(header, postId, body); }
  /**
   * Publicly read recursively nested comments with independent sibling sorting and root pagination.
   *
   * @param postId Request value used by this operation.
   * @param body Comment sorting and pagination inputs.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Patch("post/:postId/comment") public listComments(@Param("postId") postId: UUID, @core.TypedBody() body: IComment.IRequest): IPage<IComment> { return redditProvider.listComments(postId, body); }
  /**
   * Let only the author replace nonblank text on an available comment in an active community.
   *
   * @param header Request value used by this operation.
   * @param id Request value used by this operation.
   * @param body Comment fields to replace.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Put("comment/:id") public updateComment(@Headers("authorization") header: string | undefined, @Param("id") id: UUID, @core.TypedBody() body: IComment.IUpdate): IComment { return redditProvider.updateComment(header, id, body); }
  /**
   * Permanently remove the caller's own comment content while preserving required neutral reply markers.
   *
   * @param header Request value used by this operation.
   * @param id Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Delete("comment/:id") public deleteComment(@Headers("authorization") header: string | undefined, @Param("id") id: UUID): IResult { redditProvider.deleteComment(header, id); return { success: true }; }
  /**
   * Let a current owner or moderator remove any available comment in the exact active community scope.
   *
   * @param header Request value used by this operation.
   * @param communityId Request value used by this operation.
   * @param id Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Delete("community/:communityId/comment/:id") public moderateDeleteComment(@Headers("authorization") header: string | undefined, @Param("communityId") communityId: UUID, @Param("id") id: UUID): IResult { redditProvider.deleteComment(header, id, true, communityId); return { success: true }; }
  /**
   * Apply an upvote, downvote, or removal to an available post and update score and author karma together.
   *
   * @param header Request value used by this operation.
   * @param postId Request value used by this operation.
   * @param body Vote value.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Put("post/:postId/vote") public votePost(@Headers("authorization") header: string | undefined, @Param("postId") postId: UUID, @core.TypedBody() body: IVoteRequest): IVote { return redditProvider.vote(header, postId, "post", body.value); }
  /**
   * Apply an upvote, downvote, or removal to an available comment and update score and author karma together.
   *
   * @param header Request value used by this operation.
   * @param commentId Request value used by this operation.
   * @param body Vote value.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Put("comment/:commentId/vote") public voteComment(@Headers("authorization") header: string | undefined, @Param("commentId") commentId: UUID, @core.TypedBody() body: IVoteRequest): IVote { return redditProvider.vote(header, commentId, "comment", body.value); }

  /**
   * Let a current owner or moderator appoint an active user in this exact active community; duplicate assignment is a no-op.
   *
   * @param header Request value used by this operation.
   * @param communityId Request value used by this operation.
   * @param body Moderation target identifier.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Post("community/:communityId/moderator") public appointModerator(@Headers("authorization") header: string | undefined, @Param("communityId") communityId: UUID, @core.TypedBody() body: IModerationTarget): ICommunity { return redditProvider.appointModerator(header, communityId, body.userId); }
  /**
   * Let only the current owner revoke another moderator in this exact active community; owner and peer targets are protected.
   *
   * @param header Request value used by this operation.
   * @param communityId Request value used by this operation.
   * @param userId Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Delete("community/:communityId/moderator/:userId") public removeModerator(@Headers("authorization") header: string | undefined, @Param("communityId") communityId: UUID, @Param("userId") userId: UUID): ICommunity { return redditProvider.removeModerator(header, communityId, userId); }
  /**
   * Let a current owner or moderator activate a participation ban in this exact active community; the owner is protected.
   *
   * @param header Request value used by this operation.
   * @param communityId Request value used by this operation.
   * @param userId Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Post("community/:communityId/ban/:userId") public ban(@Headers("authorization") header: string | undefined, @Param("communityId") communityId: UUID, @Param("userId") userId: UUID): ICommunity { return redditProvider.ban(header, communityId, userId, true); }
  /**
   * Let a current owner or moderator end a participation ban in this exact active community; absent bans are no-ops.
   *
   * @param header Request value used by this operation.
   * @param communityId Request value used by this operation.
   * @param userId Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Delete("community/:communityId/ban/:userId") public unban(@Headers("authorization") header: string | undefined, @Param("communityId") communityId: UUID, @Param("userId") userId: UUID): ICommunity { return redditProvider.ban(header, communityId, userId, false); }
  /**
   * Privately list active bans for current owners and moderators of this exact active community.
   *
   * @param header Request value used by this operation.
   * @param communityId Request value used by this operation.
   * @param body Pagination inputs.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Patch("community/:communityId/ban") public listBans(@Headers("authorization") header: string | undefined, @Param("communityId") communityId: UUID, @core.TypedBody() body: IPage.IRequest): IPage<IBan> { return redditProvider.listBans(header, communityId, body); }
  /**
   * Privately list resolved and active ban history for current owners and moderators of this exact active community.
   *
   * @param header Request value used by this operation.
   * @param communityId Request value used by this operation.
   * @param body Pagination inputs.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Patch("community/:communityId/ban/history") public listBanHistory(@Headers("authorization") header: string | undefined, @Param("communityId") communityId: UUID, @core.TypedBody() body: IPage.IRequest): IPage<IBanHistory> { return redditProvider.listBanHistory(header, communityId, body); }
  /**
   * Let any authenticated caller report available active-community content with a nonblank reason; duplicate unresolved work is refused.
   *
   * @param header Request value used by this operation.
   * @param body Report target and reason.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Post("report") public report(@Headers("authorization") header: string | undefined, @core.TypedBody() body: IReport.ICreate): IReport { return redditProvider.report(header, body); }
  /**
   * Privately list unresolved reports for current owners and moderators of this exact active community.
   *
   * @param header Request value used by this operation.
   * @param communityId Request value used by this operation.
   * @param body Pagination inputs.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Patch("community/:communityId/report") public listReports(@Headers("authorization") header: string | undefined, @Param("communityId") communityId: UUID, @core.TypedBody() body: IPage.IRequest): IPage<IReport> { return redditProvider.listReports(header, communityId, body); }
  /**
   * Privately list resolved report outcomes for current owners and moderators of this exact active community.
   *
   * @param header Request value used by this operation.
   * @param communityId Request value used by this operation.
   * @param body Pagination inputs.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Patch("community/:communityId/report/history") public listReportHistory(@Headers("authorization") header: string | undefined, @Param("communityId") communityId: UUID, @core.TypedBody() body: IPage.IRequest): IPage<IReportHistory> { return redditProvider.listReportHistory(header, communityId, body); }
  /**
   * Let a current scoped owner or moderator approve unresolved work, deleting its available target and dependent state.
   *
   * @param header Request value used by this operation.
   * @param id Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Post("report/:id/approve") public approve(@Headers("authorization") header: string | undefined, @Param("id") id: UUID): IReport { return redditProvider.resolveReport(header, id, true); }
  /**
   * Let a current scoped owner or moderator dismiss unresolved work while retaining its available target.
   *
   * @param header Request value used by this operation.
   * @param id Request value used by this operation.
   * @returns The operation result.
   * @tag reddit
   */
  @core.TypedRoute.Post("report/:id/dismiss") public dismiss(@Headers("authorization") header: string | undefined, @Param("id") id: UUID): IReport { return redditProvider.resolveReport(header, id, false); }
}
