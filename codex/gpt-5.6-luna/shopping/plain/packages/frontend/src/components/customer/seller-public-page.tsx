import { Link, useParams } from "react-router-dom";

import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/ui";
import { useSellerPublic } from "@/lib/shopping/hooks";

export function SellerPublicPage() {
  const { id = "" } = useParams();
  const query = useSellerPublic(id);
  if (query.isPending) return <section className="page"><LoadingState label="Loading seller profile" /></section>;
  if (query.error !== null && query.error !== undefined) return <section className="page"><ErrorState error={query.error} onRetry={() => void query.refetch()} /></section>;
  if (query.data === undefined) return <section className="page"><EmptyState title="Seller not found" detail="This public shop profile is no longer available." /></section>;
  return <section className="page"><Link className="back-link" to="/app/catalog">Back to catalog</Link><PageHeader eyebrow="Customer / seller" title={query.data.shopName} detail="Public shop information is separated from private seller account and moderation state." /><Card><h2>{query.data.shopName}</h2><p>{query.data.shopDescription}</p>{query.data.logo === null ? <p className="muted">No shop logo provided.</p> : <img src={query.data.logo} alt={`${query.data.shopName} logo`} />}</Card></section>;
}

export default SellerPublicPage;
