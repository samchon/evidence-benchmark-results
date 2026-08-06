import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as api from "@benchmark/reddit2-api";

import {
  useCommunity,
  useCommunityFeed,
  useSubscribe,
  useUnsubscribe,
} from "@/lib/community/hooks";
import { usePostCreate } from "@/lib/post/hooks";
import {
  useBan,
  useBans,
  useModeratorAdd,
  useModeratorRemove,
  useModerationCommentErase,
  useModerationPostErase,
  useUnban,
} from "@/lib/moderation/hooks";
import { useReports, useReportApprove, useReportDismiss } from "@/lib/report/hooks";
import type * as CommunityHooks from "../../lib/community/hooks";
import type * as PostHooks from "../../lib/post/hooks";
import type * as ModerationHooks from "../../lib/moderation/hooks";
import type * as ReportHooks from "../../lib/report/hooks";

/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-community-model The detail screen represents the selected community.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle The detail and moderation controls remain scoped to the selected community.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Every mutation carries the selected community scope.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-002-owner-appointment-of-moderators The owner appointment control targets a moderator in this community.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-003-moderator-appointment-of-peers The moderator appointment control targets a peer in this community.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-004-owner-removal-of-moderators The owner removal control targets a moderator in this community.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-005-protect-owner-and-moderator-assignments Role mutation outcomes are surfaced without changing the selected scope.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle The moderation desk exposes the community's active ban state.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-001-enter-active-ban-state The ban action starts an active ban in this community.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-002-end-active-ban-state The unban action ends an active ban.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-content-report-model The moderation desk renders report targets and reasons.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-001-define-report-target-reporter-and-reason Report rows identify target kind and reason.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-002-relate-unresolved-reports-to-a-community-queue The report list is scoped to this community queue.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle Approve and dismiss controls expose report lifecycle actions.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-001-enter-unresolved-report-state The report list presents unresolved moderation work.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-002-approve-a-report-and-delete-its-target Approving and removing a reported target are visible actions.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-003-dismiss-a-report-and-retain-its-target Dismissing a report is a visible action separate from target removal.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-community-operations The detail screen exposes public feed, subscription, and creation surfaces.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations Subscribe and unsubscribe controls target this community.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations The post form and community feed expose post operations.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations The moderation desk exposes community-scoped role controls.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner The add-moderator control submits an owner appointment.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-002-add-a-moderator-as-community-moderator The appointment control carries the selected community and target user.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-003-remove-a-moderator-as-community-owner The remove-moderator control submits owner revocation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations The moderation desk lists and changes community bans.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-001-ban-a-user-from-a-community The ban control submits a selected community/user pair.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-002-unban-a-user-from-a-community The unban control submits a selected community/user pair.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-003-view-a-communitys-banned-users The active ban list is rendered in the moderation desk.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution The moderation desk lists and resolves community reports.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports The unresolved report queue is rendered for this community.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-003-approve-a-report The approve control resolves a report.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-004-dismiss-a-report The dismiss control resolves a report without removing its target.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules Moderation actions are presented in the selected community desk.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community All moderation mutations carry this community id.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-002-protect-owner-and-moderator-assignments-from-moderator-removal Role controls delegate protected-target refusal to the API.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-003-protect-the-owner-from-community-bans The ban control delegates owner protection to the API.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules The report queue presents the available moderation actions.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-001-require-a-valid-report-target-and-reason Resolution controls operate on an identified report target and reason.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Post creation is exposed alongside the selected community membership scope.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation The post form is owned by the selected community and its mutation carries that scope.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting API refusal is surfaced in the community action status.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access The public community feed remains rendered independently of mutation outcomes.
 * @evidence {@link CommunityHooks.useCommunity} Loads the selected community.
 * @evidence {@link CommunityHooks.useCommunityFeed} Loads its public feed.
 * @evidence {@link CommunityHooks.useSubscribe} Submits subscription start.
 * @evidence {@link CommunityHooks.useUnsubscribe} Submits subscription end.
 * @evidence {@link PostHooks.usePostCreate} Submits the post form.
 * @evidence {@link ModerationHooks.useModeratorAdd} Submits moderator appointment.
 * @evidence {@link ModerationHooks.useModeratorRemove} Submits moderator removal.
 * @evidence {@link ModerationHooks.useBan} Submits a community ban.
 * @evidence {@link ModerationHooks.useUnban} Submits a community unban.
 * @evidence {@link ModerationHooks.useBans} Loads active bans.
 * @evidence {@link ModerationHooks.useModerationPostErase} Removes a reported post as moderation.
 * @evidence {@link ModerationHooks.useModerationCommentErase} Removes a reported comment as moderation.
 * @evidence {@link ReportHooks.useReports} Loads the unresolved report queue.
 * @evidence {@link ReportHooks.useReportApprove} Approves a report.
 * @evidence {@link ReportHooks.useReportDismiss} Dismisses a report.
 */
export function CommunityPage() {
  const { id = "" } = useParams();
  const community = useCommunity(id);
  const feed = useCommunityFeed(id, { limit: 20, sort: "hot", range: "week" });
  const subscribe = useSubscribe();
  const unsubscribe = useUnsubscribe();
  const create = usePostCreate();
  const moderatorAdd = useModeratorAdd();
  const moderatorRemove = useModeratorRemove();
  const ban = useBan();
  const unban = useUnban();
  const bans = useBans(id, { limit: 20 });
  const moderatePost = useModerationPostErase();
  const moderateComment = useModerationCommentErase();
  const reports = useReports(id, { limit: 20 });
  const approve = useReportApprove();
  const dismiss = useReportDismiss();
  const [notice, setNotice] = useState("");
  const [moderationUser, setModerationUser] = useState("");

  const action = (task: Promise<unknown>, text: string) => {
    void task.then(() => setNotice(text)).catch((error: unknown) => {
      setNotice(error instanceof Error ? error.message : "Action failed");
    });
  };

  const createPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = Object.fromEntries(new FormData(event.currentTarget).entries());
    const type = String(value.type) as api.IPost.ICreate["type"];
    const body: api.IPost.ICreate = { title: String(value.title), type };
    if (type === "text") body.text = String(value.text);
    if (type === "link") body.url = String(value.url);
    if (type === "image") body.imageUrl = String(value.imageUrl);
    action(create.mutateAsync({ communityId: id, body }), "Post created");
    event.currentTarget.reset();
  };

  return (
    <div className="page-grid">
      <section className="panel hero">
        <p className="eyebrow">Community</p>
        <h1>{community.data?.name ?? "Community"}</h1>
        <p>{community.data?.description ?? "Loading community details…"}</p>
        <div className="actions">
          <button aria-label="Subscribe to community" type="button" onClick={() => action(subscribe.mutateAsync(id), "Subscribed")}>Subscribe</button>
          <button aria-label="Unsubscribe from community" type="button" onClick={() => action(unsubscribe.mutateAsync(id), "Unsubscribed")}>Unsubscribe</button>
        </div>
        {notice ? <p role="status">{notice}</p> : null}
      </section>
      <section className="panel">
        <div className="section-heading"><h2>Community feed</h2><span>{feed.data?.data.length ?? 0} posts</span></div>
        {feed.data?.data.map((post) => <article className="card" key={post.id}><h3><Link to={`/post/${post.id}`}>{post.title}</Link></h3>{post.type === "image" && post.preview ? <img className="feed-thumbnail" src={post.preview} alt={`Preview for ${post.title}`} loading="lazy" /> : <p>{post.preview}</p>}<div className="meta">{post.score} points · {post.commentCount} comments</div></article>)}
      </section>
      <section className="panel">
        <h2>Create a post</h2>
        <form className="stack" onSubmit={createPost}>
          <label>Title<input aria-label="Post title" name="title" maxLength={300} required /></label>
          <label>Type<select aria-label="Post type" name="type" defaultValue="text"><option value="text">Text</option><option value="link">Link</option><option value="image">Image</option></select></label>
          <label>Text or caption<textarea aria-label="Post text" name="text" /></label>
          <label>Link URL<input aria-label="Post link URL" type="url" name="url" /></label>
          <label>Image URL<input aria-label="Post image URL" type="url" name="imageUrl" /></label>
          <button aria-label="Publish post" type="submit">Publish post</button>
        </form>
      </section>
      <section className="panel">
        <h2>Moderation desk</h2>
        <div className="stack">
          <label>User id<input aria-label="Moderation user id" value={moderationUser} onChange={(event) => setModerationUser(event.target.value)} placeholder="UUID" /></label>
          <div className="actions">
            <button aria-label="Add moderator" type="button" onClick={() => action(moderatorAdd.mutateAsync({ communityId: id, userId: moderationUser }), "Moderator added")}>Add moderator</button>
            <button aria-label="Remove moderator" type="button" onClick={() => action(moderatorRemove.mutateAsync({ communityId: id, userId: moderationUser }), "Moderator removed")}>Remove moderator</button>
            <button aria-label="Ban user" type="button" onClick={() => action(ban.mutateAsync({ communityId: id, userId: moderationUser }), "User banned")}>Ban user</button>
            <button aria-label="Unban user" type="button" onClick={() => action(unban.mutateAsync({ communityId: id, userId: moderationUser }), "User unbanned")}>Unban user</button>
          </div>
          <p className="meta">Active bans: {bans.data?.data.length ?? 0}</p>
          <ul>{reports.data?.data.map((report) => <li className="card compact" key={report.id}><span>{report.targetType}: {report.reason}</span><span className="actions"><button aria-label="Approve report" type="button" onClick={() => action(approve.mutateAsync(report.id), "Report approved")}>Approve</button><button aria-label="Dismiss report" type="button" onClick={() => action(dismiss.mutateAsync(report.id), "Report dismissed")}>Dismiss</button><button aria-label="Remove reported target" type="button" onClick={() => action(report.targetType === "post" ? moderatePost.mutateAsync({ communityId: id, id: report.targetId }) : moderateComment.mutateAsync({ communityId: id, id: report.targetId }), "Target removed")}>Remove target</button></span></li>)}</ul>
        </div>
      </section>
    </div>
  );
}
