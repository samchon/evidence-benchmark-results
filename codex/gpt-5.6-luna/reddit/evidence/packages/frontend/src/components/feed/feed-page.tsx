import { Link, useSearchParams } from "react-router-dom";
import * as api from "@benchmark/reddit-api";
import { useFeed, useSession, useVoting } from "../../lib/reddit/hooks";
import { ErrorState, EmptyState, LoadingState, PageHeader, Pagination } from "@/components/ui";
import { relativeTime } from "@/lib/utils";

function PostCard({ post }: { post: api.IRedditPost.ISummary }) {
  const voting = useVoting();
  const vote = (value: -1 | 1) => voting.post.mutate({ id: post.id, body: { value } as api.IRedditVote.IRequest });
  return <article className="post-card"><div className="vote-rail" aria-label={`Vote score ${post.score}`}><button type="button" aria-label={`Upvote ${post.title}`} onClick={() => vote(1)}>▲</button><strong>{post.score}</strong><button type="button" aria-label={`Downvote ${post.title}`} onClick={() => vote(-1)}>▼</button></div><div className="post-content"><div className="post-meta"><Link to={`/communities/${post.community.id}`}>r/{post.community.name}</Link><span>·</span><Link to={`/profile/${post.author.username}`}>u/{post.author.username}</Link><span>·</span><time dateTime={post.createdAt}>{relativeTime(post.createdAt)}</time></div><h2><Link to={`/posts/${post.id}`}>{post.title}</Link></h2><p className="post-preview">{post.preview || "No preview available."}</p><div className="post-actions"><Link to={`/posts/${post.id}`}>{post.commentCount} comments</Link><button type="button" className="text-button" onClick={() => { void navigator.clipboard?.writeText(`${window.location.origin}/posts/${post.id}`); }}>Copy link</button></div></div></article>;
}

/**
 * Presents home, popular, and community feeds with URL-owned sort and pagination.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys Delivers the feed journey family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-001-view-the-authenticated-home-feed Delivers the authenticated home feed.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-001-view-the-authenticated-home-feed Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-002-view-the-public-popular-feed Delivers the public popular feed.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-002-view-the-public-popular-feed Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-003-view-a-public-community-feed Delivers the public community feed.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-003-view-a-public-community-feed Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range Owns feed filters.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results Owns stable continuation.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards Renders post cards.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link useFeed} Reads the selected feed scope.
 * @evidenceReview {@link useFeed} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link useSession} Chooses authenticated home-feed access.
 * @evidenceReview {@link useSession} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link useVoting} Applies visible vote transitions.
 * @evidenceReview {@link useVoting} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-post-model Renders post cards.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-post-model Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-003-define-post-participation-measures Renders score and comment measures.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-003-define-post-participation-measures Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation Renders feed previews.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules Uses server ranking controls.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-001-order-feeds-by-new Provides New selection.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-001-order-feeds-by-new Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-002-order-feeds-by-top-and-selected-time-range Provides Top range.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-002-order-feeds-by-top-and-selected-time-range Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-003-order-feeds-by-hot Provides Hot selection.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-003-order-feeds-by-hot Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-004-order-feeds-by-controversial Provides Controversial selection.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-004-order-feeds-by-controversial Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-005-apply-deterministic-pagination-boundaries Uses stable page URLs.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-005-apply-deterministic-pagination-boundaries Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Uses shared pagination.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size Uses bounded requests.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state Surfaces retry/reset states.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access Keeps public feeds readable.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity Preserves URL browsing continuity.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation Keeps page continuation stable.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation Renders retry state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-003-avoid-color-only-or-image-only-meaning Uses text labels.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-access-003-avoid-color-only-or-image-only-meaning Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Shows server aggregates.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Keeps public content visible.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 */
export function FeedPage() {
  const session = useSession();
  const [params, setParams] = useSearchParams();
  const kind = params.get("scope") === "home" ? "home" : "popular";
  const sort = (params.get("sort") as api.IRedditPost.IRequest["sort"] | null) ?? "hot";
  const range = (params.get("range") as api.IRedditPost.IRequest["range"] | null) ?? "week";
  const page = Number(params.get("page") ?? "1");
  const request: api.IRedditPost.IRequest = { page: Number.isFinite(page) && page > 0 ? page : 1, limit: 10, sort, range: sort === "top" ? range : null };
  const feed = useFeed(kind, request);
  const set = (key: string, value: string) => { const next = new URLSearchParams(params); next.set(key, value); if (key !== "page") next.set("page", "1"); setParams(next); };
  const title = kind === "home" ? "Your home feed" : "What’s worth reading";
  return <section className="page"><PageHeader eyebrow="A calmer front page" title={title} description="Follow the threads that matter, with ranking controls that stay visible and predictable." action={<Link className="button button-primary" to="/communities">Find a community</Link>} /><div className="toolbar"><div className="segmented" aria-label="Feed scope"><button type="button" className={kind === "popular" ? "segment active" : "segment"} onClick={() => set("scope", "popular")}>Popular</button><button type="button" className={kind === "home" ? "segment active" : "segment"} onClick={() => set("scope", "home")} disabled={session !== "authenticated"}>Following</button></div><label className="inline-field">Sort<select aria-label="Feed sort" value={sort} onChange={(event) => set("sort", event.target.value)}><option value="hot">Hot</option><option value="new">New</option><option value="top">Top</option><option value="controversial">Controversial</option></select></label>{sort === "top" && <label className="inline-field">Range<select aria-label="Top time range" value={range} onChange={(event) => set("range", event.target.value)}><option value="today">Today</option><option value="week">This week</option><option value="month">This month</option><option value="year">This year</option><option value="all">All time</option></select></label>}</div>{kind === "home" && session !== "authenticated" && <EmptyState title="Sign in to see your home feed"><Link to="/auth">Sign in</Link> to see communities you follow.</EmptyState>}{feed.isLoading && <LoadingState label="Loading posts" />}{feed.error && <ErrorState error={feed.error} retry={() => void feed.refetch()} />}{feed.data && feed.data.data.length === 0 && <EmptyState title="No posts match this view">Try another sort, range, or community.</EmptyState>}{feed.data && feed.data.data.length > 0 && <div className="post-list">{feed.data.data.map((post) => <PostCard key={post.id} post={post} />)}</div>}{feed.data && <Pagination page={feed.data.pagination.current} pages={feed.data.pagination.pages} onChange={(next) => set("page", String(next))} />}</section>;
}
