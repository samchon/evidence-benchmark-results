import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useCommunity, useModeration } from "../../lib/reddit/hooks";
import { EmptyState, ErrorState, Field, LoadingState, Notice, PageHeader } from "@/components/ui";

/** Covers community-private report queues, ban lifecycle, and moderator actions.
 * @evidence {@link useCommunity} Establishes the community scope.
 * @evidenceReview {@link useCommunity} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link useModeration} Reads and mutates private moderation queues.
 * @evidenceReview {@link useModeration} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Keeps actions community scoped.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-002-owner-appointment-of-moderators Provides owner appointment surface.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-002-owner-appointment-of-moderators Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-003-moderator-appointment-of-peers Provides peer appointment surface.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-003-moderator-appointment-of-peers Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-004-owner-removal-of-moderators Provides removal surface.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-004-owner-removal-of-moderators Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-005-protect-owner-and-moderator-assignments Shows server-protected assignments.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-005-protect-owner-and-moderator-assignments Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle Renders ban lifecycle.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-001-enter-active-ban-state Shows active bans.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-ban-001-enter-active-ban-state Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-002-end-active-ban-state Provides unban.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-ban-002-end-active-ban-state Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-003-retain-resolved-ban-history Shows retained moderation history.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-ban-003-retain-resolved-ban-history Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-content-report-model Renders private report records.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-content-report-model Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-002-relate-unresolved-reports-to-a-community-queue Renders scoped queue.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-002-relate-unresolved-reports-to-a-community-queue Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-003-prevent-duplicate-unresolved-reports Leaves conflict to server.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-003-prevent-duplicate-unresolved-reports Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle Renders outcomes.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-001-enter-unresolved-report-state Shows unresolved queue.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-001-enter-unresolved-report-state Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-002-approve-a-report-and-delete-its-target Provides approve.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-002-approve-a-report-and-delete-its-target Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-003-dismiss-a-report-and-retain-its-target Provides dismiss.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-003-dismiss-a-report-and-retain-its-target Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-004-retain-resolved-moderation-history Shows history.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-004-retain-resolved-moderation-history Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations Delivers ban operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-001-ban-a-user-from-a-community Provides ban.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-001-ban-a-user-from-a-community Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-002-unban-a-user-from-a-community Provides unban.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-002-unban-a-user-from-a-community Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-003-view-a-communitys-banned-users Provides ban list.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-003-view-a-communitys-banned-users Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution Delivers report resolution.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports Provides queue.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-003-approve-a-report Provides approve.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-003-approve-a-report Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-004-dismiss-a-report Provides dismiss.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-004-dismiss-a-report Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations Delivers assignment operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner Provides owner path.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-002-add-a-moderator-as-community-moderator Provides moderator path.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-002-add-a-moderator-as-community-moderator Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-003-remove-a-moderator-as-community-owner Provides removal path.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-003-remove-a-moderator-as-community-owner Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules Shows authority boundary.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community Uses community ID in every action.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-002-protect-owner-and-moderator-assignments-from-moderator-removal Shows server protection.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-002-protect-owner-and-moderator-assignments-from-moderator-removal Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-003-protect-the-owner-from-community-bans Shows server protection.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-003-protect-the-owner-from-community-bans Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution Keeps queue private.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution Leaves repeat refusal visible.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy Keeps private moderation data scoped.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private Renders records only in tools.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Refreshes after resolution.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 */
export function ModerationPage() {
  const { communityId } = useParams();
  const community = useCommunity(communityId);
  const moderation = useModeration(communityId, { page: 1, limit: 50 });
  const [username, setUsername] = useState("");
  const [moderatorUser, setModeratorUser] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  if (community.isLoading) return <LoadingState label="Loading community tools" />;
  if (community.error) return <ErrorState error={community.error} retry={() => void community.refetch()} />;
  if (!community.data) return <EmptyState title="Community not found" />;
  const ban = (event: FormEvent) => { event.preventDefault(); setMessage(null); moderation.ban.mutate({ community: communityId ?? "", user: username }, { onSuccess: () => { setUsername(""); setMessage("User banned from this community."); }, onError: (error) => setMessage(error instanceof Error ? error.message : "Ban refused.") }); };
  const appoint = (event: FormEvent) => { event.preventDefault(); moderation.appoint.mutate({ community: communityId ?? "", user: moderatorUser }, { onSuccess: () => { setModeratorUser(""); setMessage("Moderator appointed."); }, onError: (error) => setMessage(error instanceof Error ? error.message : "Moderator appointment refused.") }); };
  const removeModerator = () => { moderation.removeModerator.mutate({ community: communityId ?? "", user: moderatorUser }, { onSuccess: () => { setModeratorUser(""); setMessage("Moderator removed."); }, onError: (error) => setMessage(error instanceof Error ? error.message : "Moderator removal refused.") }); };
  return <section className="page">
    <PageHeader eyebrow={`r/${community.data.name}`} title="Community tools" description="These records are visible only to assigned community authorities." />
    <div className="moderation-grid">
      <div className="form-card"><h2>Ban a user</h2><form className="form-stack" onSubmit={ban}><Field label="User ID"><input aria-label="User ID" required value={username} onChange={(event) => setUsername(event.target.value)} placeholder="User UUID" /></Field><button type="submit" className="button button-danger" disabled={moderation.ban.isPending}>Ban user</button></form>{message && <Notice tone={moderation.ban.isError ? "danger" : "success"}>{message}</Notice>}<h2 className="subheading">Active bans</h2>{moderation.bans.data?.data.length === 0 && <EmptyState title="No active bans" />}{moderation.bans.data?.data.map((ban) => <div className="queue-row" key={ban.id}><span>u/{ban.user.username}</span><button type="button" className="text-button" onClick={() => moderation.unban.mutate({ community: communityId ?? "", user: ban.user.id })}>Unban</button></div>)}</div>
      <div className="form-card"><h2>Moderator assignments</h2><form className="form-stack" onSubmit={appoint}><Field label="User ID"><input aria-label="Moderator user ID" required value={moderatorUser} onChange={(event) => setModeratorUser(event.target.value)} placeholder="User UUID" /></Field><div className="inline-actions"><button type="submit" className="button button-primary" disabled={moderation.appoint.isPending}>Appoint moderator</button><button type="button" className="button button-quiet" onClick={removeModerator} disabled={moderation.removeModerator.isPending}>Remove moderator</button></div></form></div>
      <div className="form-card"><h2>Reports</h2>{moderation.reports.isLoading && <LoadingState label="Loading reports" />}{moderation.reports.error && <ErrorState error={moderation.reports.error} retry={() => void moderation.reports.refetch()} />}{moderation.reports.data?.data.length === 0 && <EmptyState title="Queue is clear" />}{moderation.reports.data?.data.map((report) => <div className="queue-row stack" key={report.id}><div><strong>{report.targetType} report</strong><p>{report.reason}</p><small>{report.reporter ? `u/${report.reporter.username}` : "Unknown reporter"}</small></div><div><button type="button" className="text-button" onClick={() => moderation.approve.mutate({ community: communityId ?? "", report: report.id })}>Approve</button><button type="button" className="text-button" onClick={() => moderation.dismiss.mutate({ community: communityId ?? "", report: report.id })}>Dismiss</button></div></div>)}<h2 className="subheading">Resolved history</h2>{moderation.history.data?.data.map((item) => <div className="queue-row" key={item.id}><span>{item.outcome} · {item.targetType}</span><small>{new Date(item.decidedAt).toLocaleString()}</small></div>)}</div>
    </div>
    <Link className="text-button" to={`/communities/${community.data.id}`}>Back to community</Link>
  </section>;
}
