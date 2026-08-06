import * as api from "@benchmark/reddit-api";
import { TestValidator } from "@nestia/e2e";

/**
 * Proves the primary authenticated Reddit journey across its public operations.
 *
 * 1. Register two users and create a community.
 * 2. Exercise subscription, post, feed, comment, vote, profile, and discovery operations.
 * 3. Exercise moderator assignment, ban, report, and deletion operations.
 */
export async function test_api_reddit_core(connection: api.IConnection): Promise<void> {
  const first: api.IConnection = { host: connection.host };
  const second: api.IConnection = { host: connection.host };
  const firstAuth = await api.functional.reddit.auth.user.join(first, { email: `first-${Date.now()}@example.com`, username: `first_${Date.now()}`, password: "password-one" });
  first.headers = { Authorization: `Bearer ${firstAuth.token}` };
  const secondAuth = await api.functional.reddit.auth.user.join(second, { email: `second-${Date.now()}@example.com`, username: `second_${Date.now()}`, password: "password-two" });
  second.headers = { Authorization: `Bearer ${secondAuth.token}` };
  const community = await api.functional.reddit.community.createCommunity(first, { name: `community-${Date.now()}`, description: "A test community", icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" });
  TestValidator.equals("creator is initial subscriber", community.subscriberCount, 1);
  TestValidator.equals("new community is active", community.status, "active");
  const listed = await api.functional.reddit.community.listCommunities(first, { limit: 100, search: community.name });
  TestValidator.predicate("community is discoverable", listed.data.some((item) => item.id === community.id));
  const post = await api.functional.reddit.community.post.createPost(first, community.id, { title: "Hello", type: "text", text: "World" });
  TestValidator.equals("new post starts with zero score", post.score, 0);
  TestValidator.equals("new post starts with zero comments", post.commentCount, 0);
  const feed = await api.functional.reddit.feed.popular.popularFeed(first, {});
  TestValidator.predicate("post is in popular feed", feed.data.some((item) => item.id === post.id));
  const detail = await api.functional.reddit.post.getPost(first, post.id);
  TestValidator.equals("post title persists", detail.title, "Hello");
  const comment = await api.functional.reddit.post.comment.createComment(second, post.id, { text: "Reply" });
  TestValidator.equals("comment text persists", comment.text, "Reply");
  const thread = await api.functional.reddit.post.comment.listComments(first, post.id, {});
  TestValidator.predicate("comment is visible", thread.data.some((item) => item.id === comment.id));
  const vote = await api.functional.reddit.post.vote.votePost(second, post.id, { value: "up" });
  TestValidator.equals("vote score increments", vote.score, 1);
  const profile = await api.functional.reddit.user.profile.profile(first, firstAuth.user.username);
  TestValidator.predicate("profile contains post", profile.posts.data.some((item) => item.id === post.id));
  await api.functional.reddit.community.moderator.appointModerator(first, community.id, { userId: secondAuth.user.id });
  await api.functional.reddit.community.ban.ban(second, community.id, secondAuth.user.id);
  await api.functional.reddit.community.ban.unban(second, community.id, secondAuth.user.id);
  const report = await api.functional.reddit.report.report(second, { targetId: post.id, targetType: "post", reason: "Needs review" });
  const queue = await api.functional.reddit.community.report.listReports(second, community.id, {});
  TestValidator.predicate("report is queued", queue.data.some((item) => item.id === report.id));
  await api.functional.reddit.report.dismiss(second, report.id);
  await api.functional.reddit.post.deletePost(first, post.id);
}
