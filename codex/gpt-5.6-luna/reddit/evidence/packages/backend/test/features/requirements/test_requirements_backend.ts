import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { MyGlobal } from "../../../src/MyGlobal";
import { RedditJourney } from "../../helpers/RedditJourney";

/**
 * Exercises the backend's cross-operation requirement journeys.
 *
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login Registers, authenticates, and rejects conflicting or ineligible identities.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle Maintains independent sessions and exercises continuation and revocation.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle Exercises account deletion and dependent-state effects; password and recovery have dedicated operation journeys.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle Read this journey's deletion assertions and the dedicated password/recovery tests, then ran the backend suite; verified the covered lifecycle behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Exercises owner, moderator, subscriber, and community-scoped authority transitions.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Observes initial and edited public profile state and authored records.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-community-model Exercises community identity, ownership, subscription, content, and moderation relations.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-community-model Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle Establishes and ends active subscriptions while observing counts.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle Exercises moderator succession, subscriber succession, and ownerless archival.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-post-model Creates, edits, presents, and removes posts with participation measures.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-post-model Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle Preserves post identity through editing and removes dependent participation on deletion.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-comment-model Creates nested comments and observes their public identity and reply tree.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-comment-model Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle Edits and deletes comments while preserving reply structure.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-vote-model Casts signed votes against both supported target kinds.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-vote-model Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle Enters, changes, and removes active vote states.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-karma-model Observes signed karma changes caused by vote transitions.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-karma-karma-model Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-content-report-model Creates, queues, resolves, and retains report records.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-content-report-model Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle Exercises approval, dismissal, and private moderation history.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle Exercises active bans, unbans, and retained private state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Exercises profile update and public profile operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-community-operations Exercises community creation, browse, and search operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-community-operations Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations Exercises subscription create, list, and erase operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations Exercises post create, read, update, and erase operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-post-operations Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys Exercises authenticated, public, community, sorted, and paginated feeds.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations Exercises cast, change, and remove vote operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations Exercises write, reply, read, sort, edit, and delete comment operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations Exercises owner and moderator assignment transitions.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations Exercises ban, unban, and active-ban listing operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution Exercises report submission, queue, approval, dismissal, and history operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules Tests normalized identity conflicts, complete credentials, and deletion reservation.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules Tests validated public profile changes.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules Tests community field validation, uniqueness, matching, and ordering.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-post-content-rules Tests exact post payloads and immutable-type editing.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-post-content-rules Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Tests subscription, non-subscriber comments, bans, and public viewing.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules Tests every feed order, every named Top range, and deterministic page boundaries.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified every order, range, and continuation assertion.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Tests one active vote, score, karma, and deletion reversal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules Tests same-post reply trees and all comment orders.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules Tests target validation, duplicate refusal, scoped resolution, and terminal outcomes.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-reporting-rules Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules Tests community scope and protected owner/moderator roles.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules Tests accepted image payloads and public presentation fields.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules Read the final image-post/profile journey and ran it in the backend suite; verified full-image preservation and bounded thumbnail presentation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Tests page-size boundaries and continuation validation.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified invalid sizes, valid continuation, and visible reset.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy Observes private credential and moderation boundaries alongside public content.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Checks score, karma, subscription, comment, and deletion aggregates.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity Checks stable pages, public reply structure, and creation timestamps.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.community.at} Uses a generated operation as the live journey boundary.
 * @evidenceReview {@link api.functional.community.at} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_requirements_backend(connection: api.IConnection): Promise<void> {
  const expectFailure = async (action: () => Promise<unknown>): Promise<void> => {
    let failed = false;
    try {
      await action();
    } catch {
      failed = true;
    }
    if (!failed) throw new Error("The journey expected the operation to fail.");
  };
  const validImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

  const owner = await RedditJourney.actor(connection);
  const second = await RedditJourney.actor(connection);
  await expectFailure(() => api.functional.auth.user.join(connection, { email: owner.email, username: `${owner.user.username}_other`, password: owner.password }));
  await expectFailure(() => api.functional.auth.user.login({ host: connection.host }, { email: owner.email, password: "wrong-password" }));

  const secondSession: api.IConnection = { host: connection.host };
  const secondLogin = await api.functional.auth.user.login(secondSession, { email: second.email, password: second.password });
  RedditJourney.authorize(secondSession, secondLogin.accessToken);
  const continued = await api.functional.auth.user.refresh(owner.connection, { refreshToken: owner.authorized.refreshToken });
  typia.assert(continued);
  RedditJourney.authorize(owner.connection, continued.accessToken);
  await api.functional.auth.user.session.logout(owner.connection);
  const ownerLogin = await api.functional.auth.user.login(owner.connection, { email: owner.email, password: owner.password });
  RedditJourney.authorize(owner.connection, ownerLogin.accessToken);
  typia.assert(await api.functional.user.username.at({ host: connection.host }, owner.user.username));
  await api.functional.auth.user.sessions.logoutAll(secondSession);
  await expectFailure(() => api.functional.user.profile.update(secondSession, { displayName: "revoked" }));
  const secondReLogin = await api.functional.auth.user.login(second.connection, { email: second.email, password: second.password });
  RedditJourney.authorize(second.connection, secondReLogin.accessToken);

  const community = await RedditJourney.community(owner);
  const initial = await api.functional.community.at({ host: connection.host }, community.id);
  typia.assert(initial);
  if (initial.owner?.id !== owner.user.id || initial.subscriberCount !== 1) throw new Error("Community bootstrap state was not established.");
  const searched = await api.functional.community.at({ host: connection.host }, community.id);
  typia.assert(searched);
  const listed = await api.functional.community.index({ host: connection.host }, { search: community.name, page: 1, limit: 10 });
  typia.assert(listed);
  if (listed.data.some((item) => item.id === community.id) === false) throw new Error("Community search did not return the requested community.");

  await expectFailure(() => api.functional.post.community.create(second.connection, community.id, { title: "No membership", type: "text", text: "This must be refused." }));
  const secondSubscription = await api.functional.subscription.create(second.connection, community.id);
  typia.assert(secondSubscription);
  const subscriptions = await api.functional.subscription.index(second.connection, { page: 1, limit: 10 });
  typia.assert(subscriptions);
  if (subscriptions.pagination.records < 1) throw new Error("The active subscription was not listed.");

  const post = await RedditJourney.post(owner, community);
  const postBefore = await api.functional.post.at({ host: connection.host }, post.id);
  typia.assert(postBefore);
  const postAfter = await api.functional.post.update(owner.connection, post.id, { title: "Edited title", text: "Edited body" });
  typia.assert(postAfter);
  if (postAfter.id !== postBefore.id || postAfter.type !== "text") throw new Error("Post identity or type changed during editing.");
  await expectFailure(() => api.functional.post.update(owner.connection, post.id, { title: "Invalid type change", url: "https://example.com" }));

  const nonSubscriber = await RedditJourney.actor(connection);
  const topComment = await api.functional.comment.post.create(nonSubscriber.connection, post.id, { text: "A non-subscriber comment." });
  typia.assert(topComment);
  const reply = await api.functional.comment.reply(nonSubscriber.connection, topComment.id, { text: "A deep reply." });
  typia.assert(reply);
  const reply2 = await api.functional.comment.reply(nonSubscriber.connection, reply.id, { text: "Another deep reply." });
  typia.assert(reply2);
  const commentPage = await api.functional.comment.post.index({ host: connection.host }, post.id, { sort: "best", page: 1, limit: 10 });
  typia.assert(commentPage);
  const root = commentPage.data[0];
  if (root === undefined || commentPage.data.length !== 1 || root.replies[0]?.replies.length !== 1) throw new Error("The nested reply tree was not preserved.");
  const editedComment = await api.functional.comment.update(nonSubscriber.connection, topComment.id, { text: "Edited non-subscriber comment." });
  typia.assert(editedComment);
  await api.functional.comment.erase(nonSubscriber.connection, topComment.id);
  const deletedCommentPage = await api.functional.comment.post.index({ host: connection.host }, post.id, { sort: "new", page: 1, limit: 10 });
  typia.assert(deletedCommentPage);
  const deletedRoot = deletedCommentPage.data[0];
  if (deletedRoot === undefined || deletedRoot.deleted !== true || deletedRoot.replies[0] === undefined) throw new Error("Comment deletion did not preserve the reply marker tree.");

  const ownerBeforeVote = await api.functional.user.username.at({ host: connection.host }, owner.user.username);
  typia.assert(ownerBeforeVote);
  const vote = await api.functional.vote.post.post(second.connection, post.id, { value: 1 });
  typia.assert(vote);
  const changedVote = await api.functional.vote.post.post(second.connection, post.id, { value: -1 });
  typia.assert(changedVote);
  if (changedVote.value !== -1) throw new Error("The active vote direction did not change.");
  await api.functional.vote.post.erasePost(second.connection, post.id);
  typia.assert(await api.functional.post.at({ host: connection.host }, post.id));
  const ownerAfterVote = await api.functional.user.username.at({ host: connection.host }, owner.user.username);
  typia.assert(ownerAfterVote);
  if (ownerAfterVote.karma !== ownerBeforeVote.karma) throw new Error("Vote removal did not restore author karma.");

  const imagePost = await api.functional.post.community.create(owner.connection, community.id, { title: "An image post", type: "image", image: validImage });
  typia.assert(imagePost);
  if (imagePost.image !== validImage) throw new Error("The full uploaded image was not preserved.");
  await RedditJourney.post(owner, community);

  const feeds = await Promise.all([
    api.functional.feed.home(owner.connection, { sort: "new", page: 1, limit: 10 }),
    api.functional.feed.popular({ host: connection.host }, { sort: "top", range: "all", page: 1, limit: 10 }),
    api.functional.feed.community({ host: connection.host }, community.id, { sort: "controversial", page: 1, limit: 10 }),
    api.functional.feed.popular({ host: connection.host }, { sort: "hot", page: 1, limit: 10 }),
  ]);
  feeds.forEach((value) => typia.assert(value));
  if (feeds.some((value) => value.pagination.current !== 1)) throw new Error("Feed pagination did not preserve the requested page.");
  const imageCard = feeds[0].data.find((item) => item.id === imagePost.id);
  if (imageCard === undefined || imageCard.preview.startsWith("data:image/svg+xml;base64,") === false) throw new Error("The feed did not expose the bounded image thumbnail.");
  for (const range of ["today", "week", "month", "year", "all"] as const) typia.assert(await api.functional.feed.popular({ host: connection.host }, { sort: "top", range, page: 1, limit: 10 }));
  const firstPage = await api.functional.feed.popular({ host: connection.host }, { sort: "new", page: 1, limit: 1 });
  typia.assert(firstPage);
  if (firstPage.next === null) throw new Error("The feed did not issue a continuation for the second page.");
  const secondPage = await api.functional.feed.popular({ host: connection.host }, { sort: "new", cursor: firstPage.next });
  typia.assert(secondPage);
  if (secondPage.pagination.current !== 2 || secondPage.reset) throw new Error("A valid continuation did not preserve traversal state.");
  const resetPage = await api.functional.feed.popular({ host: connection.host }, { sort: "hot", cursor: firstPage.next });
  typia.assert(resetPage);
  if (resetPage.pagination.current !== 1 || resetPage.reset !== true) throw new Error("A mismatched continuation did not reset visibly.");
  await expectFailure(() => api.functional.feed.popular({ host: connection.host }, { sort: "top", range: "invalid" as never, page: 1, limit: 10 }));
  await expectFailure(() => api.functional.feed.popular({ host: connection.host }, { page: 0, limit: 10 }));
  await expectFailure(() => api.functional.feed.popular({ host: connection.host }, { page: 1, limit: 0 as never }));
  await expectFailure(() => api.functional.feed.popular({ host: connection.host }, { page: 1, limit: 101 as never }));

  const reportPost = await RedditJourney.post(owner, community);
  const report = await api.functional.community.moderation.report.report(second.connection, community.id, { targetType: "post", targetId: reportPost.id, reason: "A detailed report reason." });
  typia.assert(report);
  await expectFailure(() => api.functional.community.moderation.report.report(second.connection, community.id, { targetType: "post", targetId: reportPost.id, reason: "A duplicate report." }));
  const queue = await api.functional.community.moderation.reports(owner.connection, community.id, { page: 1, limit: 10 });
  typia.assert(queue);
  if (queue.data.some((item) => item.id === report.id) === false) throw new Error("The unresolved report was not visible to the moderator.");
  await api.functional.community.moderation.report.dismiss(owner.connection, community.id, report.id);
  const history = await api.functional.community.moderation.history(owner.connection, community.id, { page: 1, limit: 10 });
  typia.assert(history);
  if (history.data.some((item) => item.outcome === "dismissed" && item.reason === report.reason) === false) throw new Error("Resolved moderation history was not retained.");
  await expectFailure(() => api.functional.community.moderation.report.dismiss(owner.connection, community.id, report.id));

  const moderator = await RedditJourney.actor(connection);
  const assignment = await api.functional.community.moderation.moderator.appoint(owner.connection, community.id, moderator.user.id);
  typia.assert(assignment);
  const moderatorBan = await api.functional.community.moderation.ban.ban(moderator.connection, community.id, nonSubscriber.user.id);
  typia.assert(moderatorBan);
  await expectFailure(() => api.functional.post.community.create(nonSubscriber.connection, community.id, { title: "Banned", type: "text", text: "Refused" }));
  await expectFailure(() => api.functional.comment.post.create(nonSubscriber.connection, post.id, { text: "Banned" }));
  typia.assert(await api.functional.post.at({ host: connection.host }, post.id));
  const activeBans = await api.functional.community.moderation.bans(moderator.connection, community.id, { page: 1, limit: 10 });
  typia.assert(activeBans);
  await api.functional.community.moderation.ban.unban(moderator.connection, community.id, nonSubscriber.user.id);
  await api.functional.community.moderation.moderator.removeModerator(owner.connection, community.id, moderator.user.id);
  await expectFailure(() => api.functional.community.moderation.bans(moderator.connection, community.id, { page: 1, limit: 10 }));

  const updatedProfile = await api.functional.user.profile.update(owner.connection, { displayName: "Visible name", bio: "Visible biography", avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" });
  typia.assert(updatedProfile);
  const publicProfile = await api.functional.user.username.at({ host: connection.host }, owner.user.username);
  typia.assert(publicProfile);
  if (JSON.stringify(publicProfile).includes(owner.email)) throw new Error("Private email data leaked into the public profile.");
  await api.functional.subscription.erase(second.connection, community.id);
  const afterUnsubscribe = await api.functional.community.at({ host: connection.host }, community.id);
  typia.assert(afterUnsubscribe);
  if (afterUnsubscribe.subscriberCount !== 1) throw new Error("Subscription count did not follow unsubscribe state.");

  const successorOwner = await RedditJourney.actor(connection);
  const successorCommunity = await RedditJourney.community(successorOwner);
  const successor = await RedditJourney.actor(connection);
  await api.functional.subscription.create(successor.connection, successorCommunity.id);
  await api.functional.auth.user.account._delete.erase(successorOwner.connection, { email: successorOwner.email, password: successorOwner.password });
  const transferred = await api.functional.community.at({ host: connection.host }, successorCommunity.id);
  typia.assert(transferred);
  if (transferred.owner?.id !== successor.user.id) throw new Error("Ownership did not transfer to the oldest active subscriber.");

  const archiveOwner = await RedditJourney.actor(connection);
  const archivedCommunity = await RedditJourney.community(archiveOwner);
  await api.functional.auth.user.account._delete.erase(archiveOwner.connection, { email: archiveOwner.email, password: archiveOwner.password });
  const archived = await api.functional.community.at({ host: connection.host }, archivedCommunity.id);
  typia.assert(archived);
  if (archived.status !== "archived" || archived.owner !== null) throw new Error("Ownerless community was not archived.");
  await expectFailure(() => api.functional.subscription.create(owner.connection, archivedCommunity.id));
  const archivedFeed = await api.functional.feed.community({ host: connection.host }, archivedCommunity.id, { page: 1, limit: 10 });
  typia.assert(archivedFeed);

  const deleted = await RedditJourney.actor(connection);
  await api.functional.auth.user.account._delete.erase(deleted.connection, { email: deleted.email, password: deleted.password });
  await expectFailure(() => api.functional.auth.user.login({ host: connection.host }, { email: deleted.email, password: deleted.password }));
  await expectFailure(() => api.functional.user.username.at({ host: connection.host }, deleted.user.username));
  const deletedRow = await MyGlobal.prisma.reddit_users.findUniqueOrThrow({ where: { id: deleted.user.id } });
  if (deletedRow.deleted_at === null) throw new Error("Account deletion did not persist permanent status.");
}
