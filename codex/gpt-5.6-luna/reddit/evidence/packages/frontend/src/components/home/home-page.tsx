import { useState } from "react";
import { Link } from "react-router-dom";
import * as api from "@benchmark/reddit2-api";

import { useAuthSession, useHealth, useLogout, useLogoutAll } from "@/lib/auth/hooks";
import { useCommunityCreate, useCommunities } from "@/lib/community/hooks";
import { usePopularFeed, useHomeFeed } from "../../lib/feed/hooks";
import { useSubscriptions } from "@/lib/subscription/hooks";
import { formatRelativeAge } from "@/lib/time";
import type * as FeedHooks from "../../lib/feed/hooks";
import type * as CommunityHooks from "../../lib/community/hooks";
import type * as SubscriptionHooks from "../../lib/subscription/hooks";
import type * as AuthHooks from "../../lib/auth/hooks";

/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-community-model The discovery surface represents community identity.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-001-define-community-attributes Cards render each community's public name and description.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-003-relate-communities-to-subscribers Cards and the private list render subscriber relationships and counts.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation Feed cards render title, author, community, score, comments, preview, and creation time.
 * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle The authenticated surface renders the current subscription list.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-001-bootstrap-community-owner-and-subscriber Creation and subscription entrypoints are available from the authenticated surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-community-operations Discovery and creation controls are available from the home surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community The authenticated create form submits a new community.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-002-browse-all-communities The Browse all link opens the public catalog.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-003-search-communities-by-name The search input filters the public catalog by name.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-003-list-the-current-users-subscriptions The authenticated surface renders the current user's subscription list.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys This screen composes public, authenticated, and paginated feed views.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-001-view-the-authenticated-home-feed The authenticated branch renders the subscription-scoped home feed.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-002-view-the-public-popular-feed The logged-out branch renders the public popular feed.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range The sort and time-range controls reset the feed traversal.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results The first/next controls advance the returned continuation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards Each card links to the complete post view.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules The form constraints and name search reflect the community input/discovery boundary.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-001-validate-community-creation-fields-and-unique-name Required and bounded creation fields are enforced before submission.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-002-match-and-order-community-name-search Search sends only the name filter to the catalog accessor.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules The controls expose the shared feed ranking and continuation surface.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-001-order-feeds-by-new The sort control exposes New.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-002-order-feeds-by-top-and-selected-time-range The sort and range controls expose Top and its named ranges.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-003-order-feeds-by-hot Hot is the default sort.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-004-order-feeds-by-controversial The sort control exposes Controversial.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-005-apply-deterministic-pagination-boundaries The continuation controls preserve the selected input scope.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules The feed and community requests use the shared page-size/continuation contract.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size Requests use a bounded page size of 20.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state Changing sort or range clears the continuation before refetching.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content The logged-out surface keeps public communities and feed cards readable.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent The home surface presents subscriptions alongside the authenticated feed.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Feed cards render the API's completed score, comment count, and subscriber aggregates together.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation The next/first controls expose a stable continuation traversal.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-accessible-community-participation Core feed, search, and creation controls are keyboard-operable native controls.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-001-support-keyboard-operation-for-core-journeys Native links, inputs, selects, and buttons provide keyboard operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-002-expose-understandable-labels-focus-and-validation-feedback Labels and required/min-length constraints identify the controls and feedback.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-003-avoid-color-only-or-image-only-meaning Text labels identify feed, community, and subscription states.
 * @evidence {@link AuthHooks.useAuthSession} Reads the durable session to choose the home feed.
 * @evidence {@link AuthHooks.useHealth} Renders the transport status for this screen.
 * @evidence {@link AuthHooks.useLogout} Exposes current-session logout on the authenticated home surface.
 * @evidence {@link AuthHooks.useLogoutAll} Exposes all-session revocation on the authenticated home surface.
 * @evidence {@link usePopularFeed} Loads the public ranked feed.
 * @evidence {@link FeedHooks.useHomeFeed} Loads the authenticated subscription feed.
 * @evidence {@link CommunityHooks.useCommunities} Loads the public community catalog and search.
 * @evidence {@link CommunityHooks.useCommunityCreate} Submits the community creation form.
 * @evidence {@link SubscriptionHooks.useSubscriptions} Loads the current user's subscriptions.
 */
export function HomePage() {
  const { authenticated } = useAuthSession();
  const health = useHealth();
  const logout = useLogout();
  const logoutAll = useLogoutAll();
  const [sort, setSort] = useState<api.IPost.IRequest["sort"]>("hot");
  const [range, setRange] = useState<api.IPost.IRequest["range"]>("week");
  const [continuation, setContinuation] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const feedInput = { limit: 20, sort, range, continuation } satisfies api.IPost.IRequest;
  const popular = usePopularFeed(feedInput);
  const home = useHomeFeed(feedInput, authenticated);
  const communities = useCommunities({ limit: 20, search: search || null });
  const subscriptions = useSubscriptions({ limit: 20 });
  const create = useCommunityCreate();
  const posts = authenticated && home.data ? home.data.data : popular.data?.data;
  const submitCommunity = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void create.mutateAsync({ name: String(form.get("name") ?? ""), description: String(form.get("description") ?? "") });
    event.currentTarget.reset();
  };
  return (
    <div className="page-grid">
      <section className="hero panel">
        <p className="eyebrow">Public feed</p>
        <h1>{authenticated ? "Your home" : "Discover the conversation"}</h1>
        <p>Ranked posts, stable pagination, and community discovery stay available to every reader.</p>
        <p role="status">Connection: {health.isSuccess ? "online" : health.isPending ? "checking" : "unavailable"}</p>
        {authenticated ? <div className="actions"><button type="button" onClick={() => void logout.mutateAsync()}>Log out</button><button type="button" onClick={() => void logoutAll.mutateAsync()}>Log out all sessions</button></div> : null}
        <div className="controls"><label>Sort posts<select aria-label="Sort posts" value={sort ?? "hot"} onChange={(event) => { setSort(event.target.value as api.IPost.IRequest["sort"]); setContinuation(null); }}><option value="hot">Hot</option><option value="new">New</option><option value="top">Top</option><option value="controversial">Controversial</option></select></label><label>Top range<select aria-label="Top time range" value={range ?? "week"} onChange={(event) => { setRange(event.target.value as api.IPost.IRequest["range"]); setContinuation(null); }}><option value="today">Today</option><option value="week">This week</option><option value="month">This month</option><option value="year">This year</option><option value="all">All time</option></select></label></div>
      </section>
      <section className="panel" aria-labelledby="feed-heading">
        <div className="section-heading"><h2 id="feed-heading">{authenticated ? "Home feed" : "Popular feed"}</h2><span>{posts?.length ?? 0} posts</span></div>
        {posts?.map((post) => <article className="card" key={post.id}><div className="meta">r/{post.community.name} · @{post.author.username} · {post.score} points</div><h3><Link to={`/post/${post.id}`}>{post.title}</Link></h3>{post.type === "image" && post.preview ? <img className="feed-thumbnail" src={post.preview} alt={`Preview for ${post.title}`} loading="lazy" /> : <p>{post.preview}</p>}<div className="meta">{post.commentCount} comments · {formatRelativeAge(post.createdAt)}</div></article>)}
        {posts === undefined ? <p role="status">Loading feed…</p> : null}
        <div className="actions"><button aria-label="First feed page" type="button" disabled={continuation === null} onClick={() => setContinuation(null)}>First page</button><button aria-label="Next feed page" type="button" disabled={!(authenticated ? home.data?.pagination.continuation : popular.data?.pagination.continuation)} onClick={() => setContinuation((authenticated ? home.data?.pagination.continuation : popular.data?.pagination.continuation) ?? null)}>Next page</button></div>
      </section>
      <section className="panel" aria-labelledby="communities-heading">
        <div className="section-heading"><h2 id="communities-heading">Communities</h2><Link to="/communities">Browse all</Link></div>
        <label>Search by name<input aria-label="Search communities" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search communities" /></label>
        <div className="stack">{communities.data?.data.map((community) => <Link className="card compact" key={community.id} to={`/communities/${community.id}`}><strong>r/{community.name}</strong><span>{community.subscriberCount} subscribers</span></Link>)}</div>
      </section>
      {authenticated ? <><section className="panel"><h2>Subscriptions</h2><div className="stack">{subscriptions.data?.data.map((subscription) => <span className="pill" key={subscription.community.id}>r/{subscription.community.name}</span>)}</div></section><section className="panel"><h2>Create a community</h2><form className="stack" onSubmit={submitCommunity}><label>Name<input aria-label="Community name" name="name" minLength={3} maxLength={80} required /></label><label>Description<textarea aria-label="Community description" name="description" minLength={1} maxLength={5000} required /></label><button aria-label="Create community" type="submit">Create community</button>{create.isError ? <p className="error" role="alert">{create.error.message}</p> : null}</form></section></> : <section className="panel callout"><h2>Join the conversation</h2><p>Sign in to subscribe, publish, vote, and comment.</p><Link className="button" to="/register">Create an account</Link></section>}
    </div>
  );
}
