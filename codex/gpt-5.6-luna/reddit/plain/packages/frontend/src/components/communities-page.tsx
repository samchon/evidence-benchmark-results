import { useState, type FormEvent } from "react";
import type { ICommunity } from "@benchmark/reddit-api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { useSession } from "@/lib/session";
import { Button, Card, Field, PageState, Pagination } from "@/components/ui";
import {
  errorMessage,
  useCommunities,
  useCreateCommunity,
  useSubscriptionActions,
  useSubscriptions,
} from "@/lib/hooks";
import { fileToMedia } from "@/lib/media";

export function CommunitiesPage(props: { subscriptionsOnly?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<Awaited<ReturnType<typeof fileToMedia>> | null>(
    null,
  );
  const { session } = useSession();
  const navigate = useNavigate();
  const communities = useCommunities({ search, page, limit: 12 });
  const subscriptions = useSubscriptions({ page, limit: 12 });
  const create = useCreateCommunity();
  const actions = useSubscriptionActions();
  const createCommunity = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (icon === null) {
      toast.error("Choose a JPEG, PNG, or WebP icon.");
      return;
    }
    create.mutate(
      { name, description, icon },
      {
        onSuccess: (community) => {
          toast.success("Community created");
          setShowCreate(false);
          setName("");
          setDescription("");
          setIcon(null);
          void navigate(`/community/${community.id}`, { state: { community } });
        },
      },
    );
  };
  const data: ICommunity[] | undefined = props.subscriptionsOnly
    ? subscriptions.data?.data.map((item) => item.community)
    : communities.data?.data;
  const setPage = (next: number): void => {
    setSearchParams((current) => {
      const nextParams = new URLSearchParams(current);
      nextParams.set("page", String(next));
      return nextParams;
    });
  };
  const setSearch = (next: string): void => {
    setSearchParams((current) => {
    const nextParams = new URLSearchParams(current);
    if (next.length === 0) nextParams.delete("search");
    else nextParams.set("search", next);
    nextParams.set("page", "1");
    return nextParams;
  });
  };
  const actionError = actions.subscribe.error ?? actions.unsubscribe.error;
  return (
    <div className="page-grid"><section className="main-column"><div className="page-heading"><div><p className="eyebrow">{props.subscriptionsOnly ? "Your memberships" : "Public catalog"}</p><h1>{props.subscriptionsOnly ? "Subscriptions" : "Communities"}</h1></div>{session !== null && !props.subscriptionsOnly ? <Button action={() => setShowCreate((current) => !current)}>{showCreate ? "Close form" : "Create a community"}</Button> : null}</div>
      {!props.subscriptionsOnly ? <Card className="search-card"><Field id="search-community-names" label="Search community names" value={search} onChange={setSearch} placeholder="Empty search shows every community" /></Card> : null}
      {showCreate ? <Card><h2>Create a community</h2><form className="form-stack" onSubmit={createCommunity}><Field label="Name" value={name} onChange={setName} required /><Field label="Description" value={description} onChange={setDescription} required multiline /><label className="field"><span>Icon</span><input aria-label="Community icon" type="file" accept="image/jpeg,image/png,image/webp" required onChange={(event) => { const file = event.target.files?.[0]; if (file !== undefined) void fileToMedia(file).then(setIcon).catch((error: unknown) => toast.error(errorMessage(error))); }} /></label><Button type="submit" disabled={create.isPending}>Create community</Button>{create.error !== null ? <p className="form-error" role="alert">{errorMessage(create.error)}</p> : null}</form></Card> : null}
      {actionError !== null ? <p className="form-error" role="alert">{errorMessage(actionError)}</p> : null}
      {props.subscriptionsOnly && session === null ? <PageState title="Sign in required" message="Your subscription list is private." /> : subscriptionsOnlyState(props.subscriptionsOnly, subscriptions, communities, data, actions)}
      {props.subscriptionsOnly && subscriptions.data !== undefined ? <Pagination current={subscriptions.data.pagination.current} hasNext={subscriptions.data.pagination.current < subscriptions.data.pagination.pages} reset={subscriptions.data.pagination.reset} onChange={setPage} /> : null}
      {!props.subscriptionsOnly && communities.data !== undefined ? <Pagination current={communities.data.pagination.current} hasNext={communities.data.pagination.current < communities.data.pagination.pages} reset={communities.data.pagination.reset} onChange={setPage} /> : null}
    </section><aside className="side-column"><Card><h2>Public and scoped</h2><p>Catalog entries show their current status and subscriber count. Moderation records stay inside their community.</p></Card></aside></div>
  );
}

function subscriptionsOnlyState(
  subscriptionsOnly: boolean | undefined,
  subscriptions: ReturnType<typeof useSubscriptions>,
  communities: ReturnType<typeof useCommunities>,
  data: ICommunity[] | undefined,
  actions: ReturnType<typeof useSubscriptionActions>,
) {
  const query = subscriptionsOnly ? subscriptions : communities;
  if (query.isPending) return <PageState title="Loading communities" message="Reading the current catalog." />;
  if (query.isError) return <PageState title="Communities unavailable" error={query.error} onRetry={() => void query.refetch()} />;
  if (data === undefined || data.length === 0) return <PageState title="No communities found" message="Try a different name or create the first community." />;
  return <div className="community-list">{data.map((community) => <Card key={community.id} className="community-card"><div className="community-mark" aria-hidden="true"><img src={community.icon.data} alt="" /></div><div className="community-copy"><h2><Link to={`/community/${community.id}`} state={{ community }}>r/{community.name}</Link></h2><p>{community.description}</p><p className="meta"><span className="status-label">{community.status}</span>  |  {community.subscriberCount} subscribers{community.owner === null ? "  |  no current owner" : `  |  owner ${community.owner.id.slice(0, 8)}`}</p></div>{subscriptionsOnly ? <Button variant="quiet" disabled={actions.unsubscribe.isPending} action={() => actions.unsubscribe.mutate(community.id)}>Unsubscribe</Button> : <Button variant="quiet" disabled={actions.subscribe.isPending || community.status === "archived"} action={() => actions.subscribe.mutate(community.id)}>Subscribe</Button>}</Card>)}</div>;
}
