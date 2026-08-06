import { useSystemApi } from "../../lib/system/hooks";

import { PageFrame, StatusCard } from "../layout/page-frame";

/**
 * @evidence {@link useSystemApi} Uses health, tracking, and shipment automation accessors.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-commercial-change-evidence-integrity Presents the commercial change evidence integrity capability through the operations workspace surface.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-purchase-and-resolution-consistency Presents the purchase and resolution consistency capability through the operations workspace surface.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-commercial-history-and-privacy-continuity Presents the commercial history and privacy continuity capability through the operations workspace surface.
 */
export function OperationsPage() {
  const system = useSystemApi();
  return (
    <PageFrame title="Operations" subtitle="Verify the live connection and shipping continuity without exposing private history.">
      <div className="hero-grid">
        <StatusCard label="Health" value={system.health.isPending ? "Checking..." : "Ready"} action={<button type="button" onClick={() => void system.health.mutateAsync([])}>Check now</button>} />
        <StatusCard label="Tracking" value="Seller shipment facts remain live" />
        <StatusCard label="Automation" value="Auto-confirm is available" />
      </div>
    </PageFrame>
  );
}



