import { useState, type FormEvent } from "react";
import type { ICommunity } from "@benchmark/reddit-api";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { useSession } from "@/lib/session";
import {
  Button,
  Card,
  Field,
  PageState,
  Pagination,
  PostCard,
} from "@/components/ui";
import {
  errorMessage,
  useCommunities,
  useCommunityFeed,
  useModerationActions,
  useModerationQueries,
  useSubscriptionActions,
} from "@/lib/hooks";

type CommunityRouteState = { community?: ICommunity };

export function CommunityPage(props: { communityId: string }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const sortValue = searchParams.get("sort");
  const sort: "hot" | "new" | "top" | "controversial" = sortValue === "hot" || sortValue === "top" || sortValue === "controversial"
    ? sortValue
    : "hot";
  const rangeValue = searchParams.get("range");
  const range: "today" | "week" | "month" | "year" | "all" = rangeValue === "today" || rangeValue === "week" || rangeValue === "month" || rangeValue === "year"
    ? rangeValue
    : "all";
  const pageValue = Number(searchParams.get("page") ?? "1");
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const moderationPageValue = Number(searchParams.get("moderationPage") ?? "1");
  const moderationPage = Number.isInteger(moderationPageValue) && moderationPageValue > 0 ? moderationPageValue : 1;
  const [tab, setTab] = useState<"feed" | "moderation">("feed");
  const [targetUser, setTargetUser] = useState("");
  const [action, setAction] = useState<"ban" | "unban" | "assign" | "remove">(
    "ban",
  );
  const request = sort === "top"
    ? { sort, range, page, limit: 10 }
    : { sort, page, limit: 10 };
  const feed = useCommunityFeed(props.communityId, request);
  const catalog = useCommunities({ limit: 100 });
  const moderation = useModerationQueries(props.communityId, { page: moderationPage, limit: 10 });
  const moderationActions = useModerationActions();
  const subscriptions = useSubscriptionActions();
  const { session } = useSession();
  const setModerationPage = (next: number): void => { setSearchParams((current) => { const nextParams = new URLSearchParams(current); nextParams.set("moderationPage", String(next)); return nextParams; }); };
  const setCommunityParam = (key: string, value: string | null): void => {
    setSearchParams((current) => {
      const nextParams = new URLSearchParams(current);
      if (value === null) nextParams.delete(key);
      else nextParams.set(key, value);
      if (key !== "page") nextParams.set("page", "1");
      return nextParams;
    });
  };
  const community = catalog.data?.data.find(
    (item) => item.id === props.communityId,
  ) ?? (location.state as CommunityRouteState | null)?.community;
  if (feed.isPending) return <PageState title="Loading community" message="Reading the community feed." />;
  if (feed.isError) return <PageState title="Community unavailable" error={feed.error} onRetry={() => void feed.refetch()} />;
  const displayName = community?.name ?? feed.data.data[0]?.community ?? props.communityId;
  const submitModeration = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const input = { communityId: props.communityId, userId: targetUser };
    if (action === "ban") moderationActions.ban.mutate(input, {
      onSuccess: () => toast.success("Moderation action completed"),
    });
    if (action === "unban") moderationActions.unban.mutate(input, {
      onSuccess: () => toast.success("Moderation action completed"),
    });
    if (action === "assign") moderationActions.assignModerator.mutate(input, {
      onSuccess: () => toast.success("Moderation action completed"),
    });
    if (action === "remove") moderationActions.removeModerator.mutate(input, {
      onSuccess: () => toast.success("Moderation action completed"),
    });
  };
  const actionError = moderationActions.ban.error ?? moderationActions.unban.error ?? moderationActions.assignModerator.error ?? moderationActions.removeModerator.error ?? subscriptions.subscribe.error;
  const canModerate = moderation.reports.isSuccess;
  return <div className="page-grid"><section className="main-column"><Card className="community-header"><div className="community-mark large" aria-hidden="true">{community !== undefined ? <img src={community.icon.data} alt="" /> : "R"}</div><div><p className="eyebrow">Community</p><h1>{displayName}</h1><p>{community?.description ?? "Public discussion space"}</p><p className="meta">{community?.status ?? "active"}  |  {community?.subscriberCount ?? 0} subscribers</p></div>{session !== null && community !== undefined ? <Button disabled={community.status === "archived" || subscriptions.subscribe.isPending} action={() => subscriptions.subscribe.mutate(community.id)}>Subscribe</Button> : null}</Card>{actionError !== null ? <p className="form-error" role="alert">{errorMessage(actionError)}</p> : null}<div className="tab-list" role="tablist" aria-label="Community sections"><button className={tab === "feed" ? "tab active" : "tab"} role="tab" aria-selected={tab === "feed"} type="button" onClick={() => setTab("feed")}>Feed</button>{canModerate ? <button className={tab === "moderation" ? "tab active" : "tab"} role="tab" aria-selected={tab === "moderation"} type="button" onClick={() => setTab("moderation")}>Moderation tools</button> : null}</div>{tab === "feed" || !canModerate ? <><Card className="feed-toolbar"><label>Sort<select aria-label="Community feed sort" value={sort} onChange={(event) => setCommunityParam("sort", event.target.value === "hot" ? null : event.target.value)}><option value="hot">Hot</option><option value="new">New</option><option value="top">Top</option><option value="controversial">Controversial</option></select></label>{sort === "top" ? <label>Time range<select aria-label="Community top time range" value={range} onChange={(event) => setCommunityParam("range", event.target.value === "all" ? null : event.target.value)}><option value="today">Today</option><option value="week">This week</option><option value="month">This month</option><option value="year">This year</option><option value="all">All time</option></select></label> : null}</Card>{feed.data.data.length === 0 ? <PageState title="No posts yet" message="This community is ready for its first conversation." /> : <div className="stack">{feed.data.data.map((post) => <PostCard key={post.id} post={post} />)}</div>}<Pagination current={feed.data.pagination.current} hasNext={feed.data.pagination.current < feed.data.pagination.pages} reset={feed.data.pagination.reset} onChange={(next) => setCommunityParam("page", String(next))} /></> : <ModerationPanel communityId={props.communityId} queries={moderation} actions={moderationActions} targetUser={targetUser} setTargetUser={setTargetUser} action={action} setAction={setAction} submit={submitModeration} moderationPage={moderationPage} setModerationPage={setModerationPage} />}</section><aside className="side-column"><Card><h2>Participation</h2><p>Public readers can browse archived communities. New subscriptions and participation are refused after archival.</p><Link className="text-link" to="/communities">Return to catalog</Link></Card></aside></div>;
}

function ModerationPanel(props: { communityId: string; queries: ReturnType<typeof useModerationQueries>; actions: ReturnType<typeof useModerationActions>; targetUser: string; setTargetUser: (value: string) => void; action: "ban" | "unban" | "assign" | "remove"; setAction: (value: "ban" | "unban" | "assign" | "remove") => void; submit: (event: FormEvent<HTMLFormElement>) => void; moderationPage: number; setModerationPage: (page: number) => void }) {
  const decisionError = props.actions.approve.error ?? props.actions.dismiss.error;
  const queryError = props.queries.reports.error ?? props.queries.bans.error ?? props.queries.history.error ?? decisionError;
  const decisionPending = props.actions.approve.isPending || props.actions.dismiss.isPending;
  return <div className="stack"><Card><h2>Scoped actions</h2><p className="muted">These controls call the selected community's private moderation boundary. Refusals remain visible and do not broaden authority.</p><form className="form-stack" onSubmit={props.submit}><Field label="Target user ID" value={props.targetUser} onChange={props.setTargetUser} required /><label className="field"><span>Action</span><select value={props.action} onChange={(event) => props.setAction(event.target.value as typeof props.action)}><option value="ban">Ban user</option><option value="unban">Unban user</option><option value="assign">Assign moderator</option><option value="remove">Remove moderator</option></select></label><Button type="submit">Submit scoped action</Button></form></Card>{queryError !== null ? <p className="form-error" role="alert">{errorMessage(queryError)}</p> : null}<Card><h2>Unresolved reports</h2>{props.queries.reports.data?.data.length === 0 ? <p className="muted">No unresolved reports.</p> : props.queries.reports.data?.data.map((report) => <div className="moderation-row" key={report.id}><div><strong>{report.targetKind}</strong><p>{report.target ?? "Target no longer available"}</p><p className="meta">reported by {report.reporter}  |  {report.reason}</p></div><span><Button variant="quiet" disabled={decisionPending} action={() => props.actions.approve.mutate(report.id)}>Approve</Button><Button variant="quiet" disabled={decisionPending} action={() => props.actions.dismiss.mutate(report.id)}>Dismiss</Button></span></div>)}</Card>{props.queries.reports.data !== undefined ? <Pagination current={props.queries.reports.data.pagination.current} hasNext={props.queries.reports.data.pagination.current < props.queries.reports.data.pagination.pages} reset={props.queries.reports.data.pagination.reset} onChange={props.setModerationPage} /> : null}<Card><h2>Active bans</h2>{props.queries.bans.data?.data.length === 0 ? <p className="muted">No active bans.</p> : props.queries.bans.data?.data.map((ban) => <div className="moderation-row" key={ban.id}><span>{ban.username}  |  banned by {ban.actor}</span><Button variant="quiet" action={() => props.actions.unban.mutate({ communityId: props.communityId, userId: ban.userId })}>Unban</Button></div>)}</Card>{props.queries.bans.data !== undefined ? <Pagination current={props.queries.bans.data.pagination.current} hasNext={props.queries.bans.data.pagination.current < props.queries.bans.data.pagination.pages} reset={props.queries.bans.data.pagination.reset} onChange={props.setModerationPage} /> : null}<Card><h2>Resolved history</h2>{props.queries.history.data?.data.length === 0 ? <p className="muted">No retained history.</p> : props.queries.history.data?.data.map((item) => <div className="history-row" key={item.id}><strong>{item.kind}</strong><span>{item.subject ?? "de-identified subject"}</span><span className="meta">{new Date(item.createdAt).toLocaleString()}</span></div>)}</Card>{props.queries.history.data !== undefined ? <Pagination current={props.queries.history.data.pagination.current} hasNext={props.queries.history.data.pagination.current < props.queries.history.data.pagination.pages} reset={props.queries.history.data.pagination.reset} onChange={props.setModerationPage} /> : null}</div>;
}




