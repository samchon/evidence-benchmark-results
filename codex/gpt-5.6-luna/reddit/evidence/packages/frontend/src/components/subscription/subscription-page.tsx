import { Link } from "react-router-dom";
import { useSubscriptions } from "../../lib/reddit/hooks";
import { EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/ui";

/** Covers the current user's active subscription list and immediate unsubscribe freshness.
 * @evidence {@link useSubscriptions} Reads and changes active subscriptions.
 * @evidenceReview {@link useSubscriptions} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle Renders subscription lifecycle.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-001-establish-active-subscription-state Shows active rows.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-subscription-001-establish-active-subscription-state Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-002-end-active-subscription-state Provides unfollow.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-subscription-002-end-active-subscription-state Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations Delivers subscription operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-003-list-the-current-users-subscriptions Lists current subscriptions.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-003-list-the-current-users-subscriptions Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent Refreshes membership state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 */
export function SubscriptionPage() {
  const subscriptions = useSubscriptions({ page: 1, limit: 100 });
  return <section className="page"><PageHeader eyebrow="Your reading list" title="Subscriptions" description="The communities that shape your home feed." />{subscriptions.query.isLoading && <LoadingState label="Loading subscriptions" />}{subscriptions.query.error && <ErrorState error={subscriptions.query.error} retry={() => void subscriptions.query.refetch()} />}{subscriptions.query.data?.data.length === 0 && <EmptyState title="You aren’t following any communities"><Link to="/communities">Browse communities</Link> to get started.</EmptyState>}<div className="subscription-list">{subscriptions.query.data?.data.map((item) => <div className="subscription-row" key={item.id}><div><Link to={`/communities/${item.community.id}`}><strong>r/{item.community.name}</strong></Link><p>{item.community.description}</p><small>Following since {new Date(item.startedAt).toLocaleDateString()}</small></div><button type="button" className="button button-quiet" onClick={() => subscriptions.erase.mutate(item.community.id)} disabled={subscriptions.erase.isPending}>Unfollow</button></div>)}</div></section>;
}
