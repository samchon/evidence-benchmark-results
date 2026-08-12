import { useState, type FormEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import * as api from "@benchmark/reddit-api";
import { useCommunities, useCommunity, useCommunityActions, useFeed, usePost, useSession, useSubscriptions } from "../../lib/reddit/hooks";
import { EmptyState, ErrorState, Field, LoadingState, Notice, PageHeader, Pagination } from "@/components/ui";
import { readImageFile, relativeTime } from "@/lib/utils";

function CommunityIcon({ value, large = false }: { value: string; large?: boolean }) {
  return value.startsWith("data:image/") ? <img className={large ? "community-icon large" : "community-icon"} src={value} alt="" /> : <span className={large ? "community-icon large" : "community-icon"}>{value || "r/"}</span>;
}

function CommunityCard({ community }: { community: api.IRedditCommunity.ISummary }) {
  return <Link className="community-card" to={`/communities/${community.id}`}><CommunityIcon value={community.icon} /><div><h2>r/{community.name}</h2><p>{community.description}</p><small>{community.subscriberCount} subscribers · {community.status}</small></div></Link>;
}

function CreateCommunity() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const action = useCommunityActions();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    action.create.mutate({ name, description, icon } as Parameters<typeof api.functional.community.create>[1], { onSuccess: () => setMessage("Community created."), onError: (error) => setMessage(error instanceof Error ? error.message : "Community creation was refused.") });
  };
  return <details className="details-card"><summary>Create a community</summary><form className="form-stack compact-form" onSubmit={submit}><Field label="Name"><input aria-label="Name" required minLength={3} maxLength={50} pattern="[A-Za-z0-9_-]+" value={name} onChange={(event) => setName(event.target.value)} placeholder="fieldnotes" /></Field><Field label="Description"><textarea aria-label="Description" required maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} /></Field><Field label="Icon"><input aria-label="Icon" required type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readImageFile(file).then(setIcon).catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Icon could not be read.")); }} /></Field>{message && <Notice tone={action.create.isError ? "danger" : "success"}>{message}</Notice>}<button type="submit" className="button button-primary" disabled={action.create.isPending}>Create community</button></form></details>;
}

function CommunityDetail({ id }: { id: string }) {
  const community = useCommunity(id);
  const session = useSession();
  const subscriptions = useSubscriptions({ page: 1, limit: 100 });
  const post = usePost(undefined);
  const [params, setParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [postType, setPostType] = useState<api.IRedditPost.ICreate["type"]>("text");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [postMessage, setPostMessage] = useState<string | null>(null);
  const feed = useFeed("community", { page: Number(params.get("page") ?? "1"), limit: 10, sort: "hot" }, id);
  if (community.isLoading) return <LoadingState label="Loading community" />;
  if (community.error) return <ErrorState error={community.error} retry={() => void community.refetch()} />;
  if (!community.data) return <EmptyState title="Community not found" />;
  const data = community.data;
  const subscribed = subscriptions.query.data?.data.some((item) => item.community.id === id && item.active) ?? false;
  const createPost = (event: FormEvent) => {
    event.preventDefault();
    setPostMessage(null);
    const body: api.IRedditPost.ICreate = { title, type: postType, ...(postType === "text" ? { text } : postType === "link" ? { url } : { image }) };
    post.create.mutate({ communityId: id, body }, { onSuccess: () => { setTitle(""); setText(""); setUrl(""); setImage(""); setPostMessage("Post published."); }, onError: (error) => setPostMessage(error instanceof Error ? error.message : "Post creation was refused.") });
  };
  return <section className="page"><PageHeader eyebrow={`r/${data.name}`} title={data.description} description={`${data.subscriberCount} subscribers · ${data.status === "active" ? "Active community" : "Archived, read-only"}`} action={session === "authenticated" && <button type="button" className="button button-primary" onClick={() => subscribed ? subscriptions.erase.mutate(id) : subscriptions.create.mutate(id)}>{subscribed ? "Following" : "Follow community"}</button>} /><div className="community-layout"><div><div className="toolbar"><strong>Community feed</strong><Link className="button button-quiet" to="/communities">Browse all</Link></div>{feed.isLoading && <LoadingState label="Loading posts" />}{feed.error && <ErrorState error={feed.error} retry={() => void feed.refetch()} />}{feed.data?.data.length === 0 && <EmptyState title="No posts here yet" />}{feed.data?.data.map((item) => <Link className="post-card compact" key={item.id} to={`/posts/${item.id}`}><div className="vote-rail"><strong>{item.score}</strong></div><div className="post-content"><div className="post-meta"><span>u/{item.author.username}</span><span>·</span><time dateTime={item.createdAt}>{relativeTime(item.createdAt)}</time></div><h2>{item.title}</h2><p className="post-preview">{item.preview || "Text post"}</p><div className="post-actions"><span>{item.commentCount} comments</span></div></div></Link>)}{feed.data && <Pagination page={feed.data.pagination.current} pages={feed.data.pagination.pages} onChange={(page) => { const next = new URLSearchParams(params); next.set("page", String(page)); setParams(next); }} />}</div><aside className="side-stack">{session === "authenticated" && data.status === "active" && subscribed && <details className="details-card" open><summary>Start a post</summary><form className="form-stack compact-form" onSubmit={createPost}><Field label="Title"><input aria-label="Title" required maxLength={300} value={title} onChange={(event) => setTitle(event.target.value)} /></Field><Field label="Type"><select aria-label="Type" value={postType} onChange={(event) => setPostType(event.target.value as api.IRedditPost.ICreate["type"])}><option value="text">Text</option><option value="link">Link</option><option value="image">Image</option></select></Field>{postType === "text" && <Field label="Text"><textarea aria-label="Text" required value={text} onChange={(event) => setText(event.target.value)} /></Field>}{postType === "link" && <Field label="URL"><input aria-label="URL" required type="url" value={url} onChange={(event) => setUrl(event.target.value)} /></Field>}{postType === "image" && <Field label="Image"><input aria-label="Image" required type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readImageFile(file).then(setImage).catch((error: unknown) => setPostMessage(error instanceof Error ? error.message : "Image could not be read.")); }} /></Field>}{postMessage && <Notice tone={post.create.isError ? "danger" : "success"}>{postMessage}</Notice>}<button type="submit" className="button button-primary" disabled={post.create.isPending}>Publish</button></form></details>}{session === "authenticated" && data.status === "active" && !subscribed && <Notice>Follow this community to publish a post.</Notice>}<div className="info-card"><CommunityIcon value={data.icon} large /><h2>About r/{data.name}</h2><p>{data.description}</p><dl><div><dt>Owner</dt><dd>{data.owner ? `u/${data.owner.username}` : "Archived"}</dd></div><div><dt>Subscribers</dt><dd>{data.subscriberCount}</dd></div></dl><Link className="text-button" to={`/moderation/${id}`}>Community tools</Link></div></aside></div></section>;
}

/** Covers community discovery, creation, subscription, and community-scoped posting.
 * @evidence {@link useCommunities} Reads the public community catalog.
 * @evidenceReview {@link useCommunities} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link useCommunity} Reads community detail.
 * @evidenceReview {@link useCommunity} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link useCommunityActions} Creates communities.
 * @evidenceReview {@link useCommunityActions} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link useFeed} Reads a community feed.
 * @evidenceReview {@link useFeed} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link usePost} Creates a community post.
 * @evidenceReview {@link usePost} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link useSession} Enables authenticated community actions.
 * @evidenceReview {@link useSession} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link useSubscriptions} Keeps follow state fresh.
 * @evidenceReview {@link useSubscriptions} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Presents community scope.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-001-bootstrap-community-owner-and-subscriber Presents owner/subscriber state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-001-bootstrap-community-owner-and-subscriber Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-community-model Renders community identity.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-community-model Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-001-define-community-attributes Renders attributes.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-001-define-community-attributes Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-002-relate-a-community-to-its-owner Renders ownership.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-002-relate-a-community-to-its-owner Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-003-relate-communities-to-subscribers Renders subscription counts.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-003-relate-communities-to-subscribers Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-004-relate-communities-to-content-and-moderation Links content and tools.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-004-relate-communities-to-content-and-moderation Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle Renders community lifecycle status.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-001-maintain-active-community-ownership Shows active owners.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-001-maintain-active-community-ownership Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-002-transfer-ownership-after-owner-deletion Shows owner transition output.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-002-transfer-ownership-after-owner-deletion Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-003-archive-an-ownerless-community Shows archived status.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-003-archive-an-ownerless-community Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-004-enforce-archived-community-read-only-state Disables archived posting.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-004-enforce-archived-community-read-only-state Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-community-operations Delivers community operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-community-operations Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community Provides creation form.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-002-browse-all-communities Provides catalog.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-002-browse-all-communities Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-003-search-communities-by-name Provides search.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-003-search-communities-by-name Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-003-view-a-public-community-feed Provides scoped feed.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-003-view-a-public-community-feed Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-001-create-a-post Provides text, link, and image creation.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-001-create-a-post Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-001-subscribe-to-a-community Provides subscribe.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-001-subscribe-to-a-community Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-002-unsubscribe-from-a-community Provides unsubscribe.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-002-unsubscribe-from-a-community Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules Applies community constraints.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-001-validate-community-creation-fields-and-unique-name Validates creation fields.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-community-001-validate-community-creation-fields-and-unique-name Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-002-match-and-order-community-name-search Preserves search input.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-community-002-match-and-order-community-name-search Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Shows participation state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation Gates post creation on subscription.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-media-001-validate-uploaded-image-format-and-size Presents image upload inputs.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-media-001-validate-uploaded-image-format-and-size Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent Refreshes subscription-derived views.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 */
export function CommunityPage() {
  const { id } = useParams();
  if (id) return <CommunityDetail id={id} />;
  return <CommunityCatalog />;
}

function CommunityCatalog() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const page = Number(params.get("page") ?? "1");
  const communities = useCommunities({ search: search || null, page, limit: 12 });
  return <section className="page"><PageHeader eyebrow="Find your people" title="Communities" description="Browse public communities by name, then follow the ones that give your reading a home." action={<CreateCommunity />} /><div className="search-row"><label className="search-field"><span className="sr-only">Search communities</span><input aria-label="Search communities" value={search} onChange={(event) => { const next = new URLSearchParams(params); next.set("search", event.target.value); next.set("page", "1"); setParams(next); }} placeholder="Search communities" /></label><span className="muted">{communities.data?.pagination.records ?? "—"} communities</span></div>{communities.isLoading && <LoadingState label="Loading communities" />}{communities.error && <ErrorState error={communities.error} retry={() => void communities.refetch()} />}{communities.data?.data.length === 0 && <EmptyState title={search ? "No communities match that search" : "No communities yet"}>Try a different name.</EmptyState>}<div className="community-grid">{communities.data?.data.map((community) => <CommunityCard key={community.id} community={community} />)}</div>{communities.data && <Pagination page={communities.data.pagination.current} pages={communities.data.pagination.pages} onChange={(nextPage) => { const next = new URLSearchParams(params); next.set("page", String(nextPage)); setParams(next); }} />}</section>;
}
