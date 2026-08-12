import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type {
  IAuth,
  IBan,
  IComment,
  ICommunity,
  ICommunityCreate,
  ICommunityRequest,
  IPage,
  IPost,
  IProfile,
  IProfileRequest,
  IProfileUpdate,
  IReport,
  IReportCreate,
  ISubscription,
  IVote,
  IVoteRequest,
  IAccountDelete,
  IModerationHistory,
} from "@benchmark/reddit-api";
import { Auth } from "../decorators/Auth";
import type { AuthPayload } from "../utils/AuthUtil";
import { RedditProvider } from "../providers/RedditProvider";

/** Publishes the complete requirement-derived Reddit API contract. */
@Controller()
export class RedditController {
  /**
   * Register a public account, create its initial profile, and start its first session.
   * The anonymous caller chooses the email, username, and password; the created
   * identity is the owner of the returned session. Rejects duplicate identities
   * and invalid credentials, and returns the public identity plus access and
   * refresh tokens.
   *
   * @param body New account credentials
   * @returns The created public identity and session tokens
   * @setHeader accessToken Authorization
   * @tag Auth
   */
  @core.TypedRoute.Post("auth/join")
  public join(@core.TypedBody() body: IAuth.IJoin): Promise<IAuth.IAuthorized> { return RedditProvider.join(body); }
  /**
   * Authenticate an active account and start an independent session.
   * The anonymous caller must provide the registered email and password; the
   * session belongs only to that account. Rejects unknown, deleted, or
   * incorrectly authenticated identities and returns fresh session tokens.
   *
   * @param body Registered account credentials
   * @returns The authenticated public identity and session tokens
   * @setHeader accessToken Authorization
   * @tag Auth
   */
  @core.TypedRoute.Post("auth/login")
  public login(@core.TypedBody() body: IAuth.ILogin): Promise<IAuth.IAuthorized> { return RedditProvider.login(body); }
  /**
   * Continue one active session with its refresh proof.
   * The anonymous caller presents a valid refresh token; the existing session
   * is renewed and the returned access token authenticates that same account.
   * Rejects invalid or expired refresh proofs and proofs for revoked sessions.
   *
   * @param body Refresh proof
   * @returns The continued public identity and renewed session tokens
   * @setHeader accessToken Authorization
   * @tag Auth
   */
  @core.TypedRoute.Post("auth/refresh")
  public refresh(@core.TypedBody() body: IAuth.IRefresh): Promise<IAuth.IAuthorized> { return RedditProvider.refresh(body); }
  /**
   * Revoke only the authenticated caller's current session.
   * The caller owns the session selected by the access token; no other session
   * is changed. Rejects an absent, expired, or revoked session and returns the
   * successful revocation transition.
   *
   * @param actor Current authenticated session
   * @returns Whether the current session was revoked
   * @tag Auth
   */
  @core.TypedRoute.Post("auth/logout")
  public logout(@Auth() actor: AuthPayload | null): Promise<boolean> { return RedditProvider.logout(actor); }
  /**
   * Revoke every active session belonging to the authenticated account.
   * The caller may affect only sessions owned by that account; all active
   * sessions are revoked while the operation itself reports success.
   * Rejects an absent, expired, or revoked session.
   *
   * @param actor Current authenticated session
   * @returns Whether the account's active sessions were revoked
   * @tag Auth
   */
  @core.TypedRoute.Post("auth/logout-all")
  public logoutAll(@Auth() actor: AuthPayload | null): Promise<boolean> { return RedditProvider.logoutAll(actor); }
  /**
   * Replace the authenticated account password and revoke every other session.
   * Only the current account may change its password and it must confirm the
   * current password. Rejects a failed confirmation or invalid new password;
   * the current session remains usable and other sessions are revoked.
   *
   * @param actor Current authenticated session
   * @param body Current and replacement passwords
   * @returns Whether the password transition succeeded
   * @tag Auth
   */
  @core.TypedRoute.Put("auth/password")
  public password(@Auth() actor: AuthPayload | null, @core.TypedBody() body: IAuth.IPassword): Promise<boolean> { return RedditProvider.changePassword(actor, body); }
  /**
   * Request a password-recovery proof through the registered email boundary.
   * An anonymous caller supplies an email address; known active accounts receive
   * a persisted delivery effect, while unknown or deleted accounts receive the
   * same neutral success result. The proof is never returned by this operation.
   *
   * @param body Recovery email address
   * @returns Neutral success regardless of account discovery
   * @tag Auth
   */
  @core.TypedRoute.Post("auth/recovery/request")
  public recoveryRequest(@core.TypedBody() body: IAuth.IRecoveryRequest): Promise<boolean> { return RedditProvider.recoveryRequest(body); }
  /**
   * Consume a valid password-recovery proof and replace the account password.
   * The anonymous caller presents the delivered proof; successful consumption
   * revokes every existing session. Rejects unknown, expired, used, or invalid
   * proofs and returns the password transition result.
   *
   * @param body Recovery proof and replacement password
   * @returns Whether the recovery transition succeeded
   * @tag Auth
   */
  @core.TypedRoute.Post("auth/recovery/complete")
  public recoveryComplete(@core.TypedBody() body: IAuth.IRecoveryComplete): Promise<boolean> { return RedditProvider.recoveryComplete(body); }
  /**
   * Permanently withdraw the authenticated account after password confirmation.
   * Only the current account may request deletion and must confirm its password;
   * authored content is de-identified or removed and community ownership is
   * transferred or archived according to the remaining subscribers. Rejects a
   * failed confirmation or absent session.
   *
   * @param actor Current authenticated session
   * @param body Deletion password confirmation
   * @returns Whether the account withdrawal succeeded
   * @tag Auth
   */
  @core.TypedRoute.Post("auth/account/delete")
  public deleteAccount(@Auth() actor: AuthPayload | null, @core.TypedBody() body: IAccountDelete): Promise<boolean> { return RedditProvider.deleteAccount(actor, body.password); }

  /**
   * Read a public profile by username with independently paged authored posts
   * and comments. The anonymous caller may read only an active public identity;
   * deleted identities are refused. The response includes public profile fields,
   * karma, avatar, and the requested page results.
   *
   * @param username Public profile username
   * @param body Post and comment pagination requests
   * @returns The public profile and its two authored-content pages
   * @tag Profile
   */
  @core.TypedRoute.Patch("profile/:username")
  public profile(@core.TypedParam("username") username: string, @core.TypedBody() body: IProfileRequest): Promise<IProfile> { return RedditProvider.profile(username, body.posts, body.comments); }
  /**
   * Edit only the authenticated account's public profile fields.
   * The caller owns the profile selected by its session and may change display
   * name, biography, or avatar; the identity and authored content remain stable.
   * Rejects an absent session or invalid media and returns the persisted profile.
   *
   * @param actor Current authenticated session
   * @param body Editable public profile fields
   * @returns The updated public profile
   * @tag Profile
   */
  @core.TypedRoute.Put("profile")
  public updateProfile(@Auth() actor: AuthPayload | null, @core.TypedBody() body: IProfileUpdate): Promise<IProfile> { return RedditProvider.updateProfile(actor, body); }

  /**
   * Create an active community and bootstrap owner and subscriber authority.
   * The authenticated caller becomes the owner and first subscriber; duplicate
   * names, invalid descriptions, and invalid icons are refused. The response is
   * the newly persisted community.
   *
   * @param actor Current authenticated session
   * @param body Community name, description, and icon
   * @returns The created community with owner and subscriber count
   * @tag Community
   */
  @core.TypedRoute.Post("communities")
  public createCommunity(@Auth() actor: AuthPayload | null, @core.TypedBody() body: ICommunityCreate): Promise<ICommunity> { return RedditProvider.createCommunity(actor, body); }
  /**
   * Browse or name-search the public community catalog.
   * The anonymous caller may read active and archived public communities; the
   * optional search is case-insensitive and the page is stable and bounded.
   * Invalid pagination or continuation is refused or reset as documented.
   *
   * @param body Search, pagination, and continuation request
   * @returns One page of public communities
   * @tag Community
   */
  @core.TypedRoute.Patch("communities")
  public communities(@core.TypedBody() body: ICommunityRequest): Promise<IPage<ICommunity>> { return RedditProvider.communities(body); }
  /**
   * Subscribe the authenticated account to an active community.
   * The caller owns the membership; archived communities are refused, while
   * an already-active membership is a no-change success. The response reports
   * the community's current subscriber state.
   *
   * @param actor Current authenticated session
   * @param communityId Target community
   * @returns The community after membership activation
   * @tag Subscription
   */
  @core.TypedRoute.Post("community/:communityId/subscribe")
  public subscribe(@Auth() actor: AuthPayload | null, @core.TypedParam("communityId") communityId: string): Promise<ICommunity> { return RedditProvider.subscribe(actor, communityId); }
  /**
   * End the authenticated account's subscription without deleting participation.
   * The caller may remove only its own membership; the community remains public
   * and authored content is retained. An absent membership is a successful no-op.
   *
   * @param actor Current authenticated session
   * @param communityId Target community
   * @returns The community after membership termination
   * @tag Subscription
   */
  @core.TypedRoute.Delete("community/:communityId/subscribe")
  public unsubscribe(@Auth() actor: AuthPayload | null, @core.TypedParam("communityId") communityId: string): Promise<ICommunity> { return RedditProvider.unsubscribe(actor, communityId); }
  /**
   * List the authenticated account's active subscriptions.
   * The caller sees only its own active memberships in a stable bounded page;
   * archived or ended memberships are excluded. Rejects an absent session.
   *
   * @param actor Current authenticated session
   * @param body Pagination and continuation request
   * @returns One page of the caller's active subscriptions
   * @tag Subscription
   */
  @core.TypedRoute.Patch("subscriptions")
  public subscriptions(@Auth() actor: AuthPayload | null, @core.TypedBody() body: IPage.IRequest): Promise<IPage<ISubscription>> { return RedditProvider.subscriptions(actor, body); }

  /**
   * Publish one validated text, link, or image post in an active community.
   * The authenticated caller must be an active subscriber and not be banned;
   * exactly one valid payload kind is persisted. Invalid content, membership,
   * or moderation state is refused.
   *
   * @param actor Current authenticated session
   * @param body Community and type-specific post payload
   * @returns The persisted post and public ownership data
   * @tag Post
   */
  @core.TypedRoute.Post("posts")
  public createPost(@Auth() actor: AuthPayload | null, @core.TypedBody() body: IPost.ICreate): Promise<IPost> { return RedditProvider.createPost(actor, body); }
  /**
   * Read one available post publicly.
   * The anonymous caller may read a post whose community and post are active;
   * missing or deleted posts are refused. The response includes its public
   * payload, author, community, score, and comment count.
   *
   * @param id Target post identifier
   * @returns The public post detail
   * @tag Post
   */
  @core.TypedRoute.Get("post/:id")
  public post(@core.TypedParam("id") id: string): Promise<IPost> { return RedditProvider.post(id); }
  /**
   * Browse the authenticated home feed scoped to the caller's active subscriptions.
   * The caller sees only public posts from those communities, in the requested
   * stable order and page; invalid sort, range, or continuation is refused or reset.
   *
   * @param actor Current authenticated session
   * @param body Feed sort, range, pagination, and continuation request
   * @returns One page of subscribed-community post summaries
   * @tag Feed
   */
  @core.TypedRoute.Patch("feed/home")
  public homeFeed(@Auth() actor: AuthPayload | null, @core.TypedBody() body: IPost.IRequest): Promise<IPage<IPost.ISummary>> { return RedditProvider.feed(actor, "home", null, body); }
  /**
   * Browse the public all-community popular feed.
   * The anonymous caller sees public posts across active and archived communities
   * according to the requested sort, range, and stable page; invalid requests are refused.
   *
   * @param body Feed sort, range, pagination, and continuation request
   * @returns One page of public post summaries
   * @tag Feed
   */
  @core.TypedRoute.Patch("feed/popular")
  public popularFeed(@core.TypedBody() body: IPost.IRequest): Promise<IPage<IPost.ISummary>> { return RedditProvider.feed(null, "popular", null, body); }
  /**
   * Browse one public community feed.
   * The anonymous caller may read public posts in the identified community,
   * including an archived community, using the requested stable sort and page.
   * Unknown communities or invalid feed requests are refused.
   *
   * @param communityId Target community
   * @param body Feed sort, range, pagination, and continuation request
   * @returns One page of that community's public post summaries
   * @tag Feed
   */
  @core.TypedRoute.Patch("community/:communityId/feed")
  public communityFeed(@core.TypedParam("communityId") communityId: string, @core.TypedBody() body: IPost.IRequest): Promise<IPage<IPost.ISummary>> { return RedditProvider.feed(null, "community", communityId, body); }
  /**
   * Edit an authored post without changing its type or identity.
   * The authenticated caller must own the post and may update only its editable
   * fields while its community remains active and available. Invalid payloads,
   * ownership, or moderation state are refused.
   *
   * @param actor Current authenticated session
   * @param id Target post identifier
   * @param body Editable post fields
   * @returns The updated post
   * @tag Post
   */
  @core.TypedRoute.Put("post/:id")
  public updatePost(@Auth() actor: AuthPayload | null, @core.TypedParam("id") id: string, @core.TypedBody() body: IPost.IUpdate): Promise<IPost> { return RedditProvider.updatePost(actor, id, body); }
  /**
   * Permanently delete an authored post.
   * The authenticated caller may delete only its own available post; the public
   * post and its dependent content become unavailable while required history is retained.
   *
   * @param actor Current authenticated session
   * @param id Target post identifier
   * @returns Whether the authored post was deleted
   * @tag Post
   */
  @core.TypedRoute.Delete("post/:id")
  public deleteOwnPost(@Auth() actor: AuthPayload | null, @core.TypedParam("id") id: string): Promise<boolean> { return RedditProvider.deleteOwnPost(actor, id); }
  /**
   * Delete any available post in a community where the authenticated caller is
   * an owner or moderator. Other communities, missing authority, and unavailable
   * posts are refused; the target is removed and moderation history is retained.
   *
   * @param actor Current authenticated moderator session
   * @param id Target post identifier
   * @returns Whether the moderated post was deleted
   * @tag Moderation
   */
  @core.TypedRoute.Delete("moderation/post/:id")
  public deleteModeratedPost(@Auth() actor: AuthPayload | null, @core.TypedParam("id") id: string): Promise<boolean> { return RedditProvider.deleteModeratedPost(actor, id); }

  /**
   * Add a top-level comment or same-post reply to an available post.
   * The authenticated caller may participate without subscribing, but banned or
   * unavailable targets are refused; a reply must belong to the same post.
   *
   * @param actor Current authenticated session
   * @param body Post, optional parent, and comment text
   * @returns The persisted comment and its public author
   * @tag Comment
   */
  @core.TypedRoute.Post("comments")
  public createComment(@Auth() actor: AuthPayload | null, @core.TypedBody() body: IComment.ICreate): Promise<IComment> { return RedditProvider.createComment(actor, body); }
  /**
   * View a recursively nested public comment thread for an available post.
   * The anonymous caller receives stable root pagination and descendant replies;
   * deleted parents remain neutral markers when required to preserve replies.
   *
   * @param postId Target post identifier
   * @param body Comment sort, pagination, and continuation request
   * @returns One page of recursively nested public comments
   * @tag Comment
   */
  @core.TypedRoute.Patch("post/:postId/comments")
  public comments(@core.TypedParam("postId") postId: string, @core.TypedBody() body: IComment.IRequest): Promise<IPage<IComment>> { return RedditProvider.comments(postId, body); }
  /**
   * Edit an authored comment's text.
   * The authenticated caller must own the available comment and its post; blank,
   * invalid, or unauthorized edits are refused and the persisted comment is returned.
   *
   * @param actor Current authenticated session
   * @param id Target comment identifier
   * @param body Replacement comment text
   * @returns The updated comment
   * @tag Comment
   */
  @core.TypedRoute.Put("comment/:id")
  public updateComment(@Auth() actor: AuthPayload | null, @core.TypedParam("id") id: string, @core.TypedBody() body: IComment.IUpdate): Promise<IComment> { return RedditProvider.updateComment(actor, id, body); }
  /**
   * Delete an authored comment while preserving required reply markers.
   * The authenticated caller may delete only its own available comment; reply-free
   * comments disappear and parents with replies become neutral markers.
   *
   * @param actor Current authenticated session
   * @param id Target comment identifier
   * @returns Whether the authored comment was deleted
   * @tag Comment
   */
  @core.TypedRoute.Delete("comment/:id")
  public deleteOwnComment(@Auth() actor: AuthPayload | null, @core.TypedParam("id") id: string): Promise<boolean> { return RedditProvider.deleteOwnComment(actor, id); }
  /**
   * Delete any available comment in a community where the authenticated caller is
   * an owner or moderator. Cross-community, unauthorized, and unavailable targets
   * are refused; required reply markers and moderation history are retained.
   *
   * @param actor Current authenticated moderator session
   * @param id Target comment identifier
   * @returns Whether the moderated comment was deleted
   * @tag Moderation
   */
  @core.TypedRoute.Delete("moderation/comment/:id")
  public deleteModeratedComment(@Auth() actor: AuthPayload | null, @core.TypedParam("id") id: string): Promise<boolean> { return RedditProvider.deleteModeratedComment(actor, id); }

  /**
   * Enter or replace one signed vote on an available post or comment.
   * The authenticated caller owns at most one signed value per target; changing
   * direction replaces its prior contribution and updates score and karma.
   * Invalid or unavailable targets are refused.
   *
   * @param actor Current authenticated session
   * @param body Target identifier and vote value
   * @returns The persisted vote
   * @tag Vote
   */
  @core.TypedRoute.Post("votes")
  public vote(@Auth() actor: AuthPayload | null, @core.TypedBody() body: IVoteRequest): Promise<IVote> { return RedditProvider.vote(actor, body); }
  /**
   * Remove the authenticated caller's current post vote.
   * Only that caller's contribution is removed; an absent vote is a successful
   * no-op and the target's score and author karma are adjusted when present.
   *
   * @param actor Current authenticated session
   * @param postId Target post identifier
   * @returns Whether the removal operation succeeded, including an absent-vote no-op
   * @tag Vote
   */
  @core.TypedRoute.Delete("votes/post/:postId")
  public removePostVote(@Auth() actor: AuthPayload | null, @core.TypedParam("postId") postId: string): Promise<boolean> { return RedditProvider.removeVoteTarget(actor, postId, null); }
  /**
   * Remove the authenticated caller's current comment vote.
   * Only that caller's contribution is removed; an absent vote is a successful
   * no-op and the target's score and author karma are adjusted when present.
   *
   * @param actor Current authenticated session
   * @param commentId Target comment identifier
   * @returns Whether the removal operation succeeded, including an absent-vote no-op
   * @tag Vote
   */
  @core.TypedRoute.Delete("votes/comment/:commentId")
  public removeCommentVote(@Auth() actor: AuthPayload | null, @core.TypedParam("commentId") commentId: string): Promise<boolean> { return RedditProvider.removeVoteTarget(actor, null, commentId); }

  /**
   * Submit one unresolved private report for an available post or comment.
   * The authenticated caller may report an available target; duplicate unresolved
   * reports, invalid reasons, and unavailable targets are refused. The report is
   * visible only to scoped moderators.
   *
   * @param actor Current authenticated session
   * @param body Target identifier and report reason
   * @returns The persisted unresolved report
   * @tag Report
   */
  @core.TypedRoute.Post("reports")
  public report(@Auth() actor: AuthPayload | null, @core.TypedBody() body: IReportCreate): Promise<IReport> { return RedditProvider.report(actor, body); }
  /**
   * Read unresolved reports in a community owned or moderated by the caller.
   * The authenticated owner or moderator sees only that community's private
   * queue in a stable page; other actors and communities are refused.
   *
   * @param actor Current authenticated moderator session
   * @param communityId Target community
   * @param body Pagination and continuation request
   * @returns One page of unresolved private reports
   * @tag Report
   */
  @core.TypedRoute.Patch("community/:communityId/reports")
  public reports(@Auth() actor: AuthPayload | null, @core.TypedParam("communityId") communityId: string, @core.TypedBody() body: IPage.IRequest): Promise<IPage<IReport>> { return RedditProvider.reports(actor, communityId, body); }
  /**
   * Approve a scoped unresolved report and delete its target.
   * Only the community owner or moderator may decide the report; the target is
   * removed atomically with the decision and a retained moderation-history entry.
   * Repeated or cross-community decisions are refused.
   *
   * @param actor Current authenticated moderator session
   * @param id Target report identifier
   * @returns Whether the report was approved
   * @tag Report
   */
  @core.TypedRoute.Put("report/:id/approve")
  public approveReport(@Auth() actor: AuthPayload | null, @core.TypedParam("id") id: string): Promise<boolean> { return RedditProvider.decideReport(actor, id, "approved"); }
  /**
   * Dismiss a scoped unresolved report and retain its target.
   * Only the community owner or moderator may decide the report; the target stays
   * publicly available and a retained history entry records the dismissal.
   * Repeated or cross-community decisions are refused.
   *
   * @param actor Current authenticated moderator session
   * @param id Target report identifier
   * @returns Whether the report was dismissed
   * @tag Report
   */
  @core.TypedRoute.Put("report/:id/dismiss")
  public dismissReport(@Auth() actor: AuthPayload | null, @core.TypedParam("id") id: string): Promise<boolean> { return RedditProvider.decideReport(actor, id, "dismissed"); }

  /**
   * Appoint a moderator in a community owned by the caller or moderated by it.
   * The target user must be active; owners and current moderators may appoint,
   * existing assignments are successful no-ops, and the new role is scoped to this community.
   *
   * @param actor Current authenticated owner or moderator session
   * @param communityId Target community
   * @param userId Active user receiving the role
   * @returns Whether the role was assigned
   * @tag Moderation
   */
  @core.TypedRoute.Post("community/:communityId/moderators/:userId")
  public assignModerator(@Auth() actor: AuthPayload | null, @core.TypedParam("communityId") communityId: string, @core.TypedParam("userId") userId: string): Promise<boolean> { return RedditProvider.assignModerator(actor, communityId, userId); }
  /**
   * Revoke a moderator assignment as the current community owner.
   * Only the owner may remove a role; owners cannot be removed and absent roles
   * are successful no-ops. The response reports whether a role changed.
   *
   * @param actor Current authenticated owner session
   * @param communityId Target community
   * @param userId Moderator whose role is removed
   * @returns Whether the role was removed
   * @tag Moderation
   */
  @core.TypedRoute.Delete("community/:communityId/moderators/:userId")
  public removeModerator(@Auth() actor: AuthPayload | null, @core.TypedParam("communityId") communityId: string, @core.TypedParam("userId") userId: string): Promise<boolean> { return RedditProvider.removeModerator(actor, communityId, userId); }
  /**
   * Start an active community ban.
   * An owner or moderator may ban an active non-owner user in its community;
   * owner targets and unauthorized scopes are refused. The ban blocks posting
   * and commenting while public reads, voting, and reporting remain available.
   *
   * @param actor Current authenticated owner or moderator session
   * @param communityId Target community
   * @param userId User receiving the ban
   * @returns Whether the target is now actively banned
   * @tag Moderation
   */
  @core.TypedRoute.Post("community/:communityId/bans/:userId")
  public ban(@Auth() actor: AuthPayload | null, @core.TypedParam("communityId") communityId: string, @core.TypedParam("userId") userId: string): Promise<boolean> { return RedditProvider.ban(actor, communityId, userId); }
  /**
   * End an active community ban.
   * An owner or moderator may end a ban in its community; an absent ban is a
   * successful no-op and active moderation scope is required.
   *
   * @param actor Current authenticated owner or moderator session
   * @param communityId Target community
   * @param userId Banned user
   * @returns Whether an active ban was ended
   * @tag Moderation
   */
  @core.TypedRoute.Delete("community/:communityId/bans/:userId")
  public unban(@Auth() actor: AuthPayload | null, @core.TypedParam("communityId") communityId: string, @core.TypedParam("userId") userId: string): Promise<boolean> { return RedditProvider.unban(actor, communityId, userId); }
  /**
   * List active bans in a community for its current owner or moderators.
   * The authenticated caller sees only the scoped private list in stable bounded
   * pages; ended bans are excluded and other actors are refused.
   *
   * @param actor Current authenticated moderator session
   * @param communityId Target community
   * @param body Pagination and continuation request
   * @returns One page of active community bans
   * @tag Moderation
   */
  @core.TypedRoute.Patch("community/:communityId/bans")
  public banned(@Auth() actor: AuthPayload | null, @core.TypedParam("communityId") communityId: string, @core.TypedBody() body: IPage.IRequest): Promise<IPage<IBan>> { return RedditProvider.banned(actor, communityId, body); }
  /**
   * List private resolved-report and moderation history for current moderators.
   * The authenticated owner or moderator sees only the selected community's
   * retained decisions and role events in stable bounded pages; other actors are refused.
   *
   * @param actor Current authenticated moderator session
   * @param communityId Target community
   * @param body Pagination and continuation request
   * @returns One page of private moderation history
   * @tag Moderation
   */
  @core.TypedRoute.Patch("community/:communityId/moderation-history")
  public history(@Auth() actor: AuthPayload | null, @core.TypedParam("communityId") communityId: string, @core.TypedBody() body: IPage.IRequest): Promise<IPage<IModerationHistory>> { return RedditProvider.history(actor, communityId, body); }
}
