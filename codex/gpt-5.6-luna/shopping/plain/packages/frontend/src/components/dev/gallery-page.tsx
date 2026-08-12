import { Card, EmptyState, ErrorState, LoadingState, PageHeader, StatusPill } from "@/components/ui";

export function GalleryPage() {
  if (!import.meta.env.DEV) return null;
  return <section className="page"><PageHeader eyebrow="Developer gallery" title="State coverage" detail="Development-only fixtures make loading, empty, failure, and domain-status states easy to inspect without changing production routes." /><div className="gallery-grid"><LoadingState label="Loading catalog" /><EmptyState title="No products match" detail="Try another search or remove the category filter." /><ErrorState error={new Error("The live service did not answer.")} onRetry={() => undefined} /><Card><p className="eyebrow">Status language</p><div className="status-row"><StatusPill value="Approved" tone="good" /><StatusPill value="Pending" tone="warn" /><StatusPill value="Unavailable" tone="bad" /><StatusPill value="Retained" /></div></Card></div></section>;
}
