import { useHealth } from "../../lib/reddit/hooks";
import { ErrorState, LoadingState, PageHeader } from "@/components/ui";

/** Displays the explicit service health response and retry state.
 * @evidence {@link useHealth} Reads the API health response.
 * @evidenceReview {@link useHealth} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 */
export function HealthPage() { const health = useHealth(); return <section className="narrow-page"><PageHeader eyebrow="System" title="Service status" description="A small, honest check of the API connection." />{health.isLoading && <LoadingState label="Checking service" />}{health.error && <ErrorState error={health.error} retry={() => void health.refetch()} />}{health.data && <div className="health-card"><span className="status-dot" /> <strong>{health.data}</strong><p>The API is responding to the generated contract.</p></div>}</section>; }
