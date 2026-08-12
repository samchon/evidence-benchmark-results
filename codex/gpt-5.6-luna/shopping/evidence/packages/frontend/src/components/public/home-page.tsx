import { queryOptions, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { useShoppingOperations } from "../../lib/shopping/hooks";

/**
 * Public landing screen for discovery, authentication, and the health boundary.
 * @evidence {@link useShoppingOperations} Reads the live health boundary through the shared hook.
 * @evidenceReview {@link useShoppingOperations} Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Renders the public entry boundary.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Re-read the public links and health-state branch; confirmed this page owns the unauthenticated entry boundary and routes protected work to the authentication surface.
 */
export function HomePage() {
  const operations = useShoppingOperations();
  const health = useQuery(queryOptions({ queryKey: ["health", operations] as const, queryFn: operations.Get }));
  return (
    <section className="home-page page-stack">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">A considered marketplace</p>
          <h1>benchmark-shopping</h1>
          <p className="hero-lede">Find well-made things, understand where they came from, and keep every purchase detail close at hand.</p>
          <div className="button-row"><Link className="button button-dark" to="/catalog">Browse the collection</Link><Link className="button button-outline" to="/auth">Create an account</Link></div>
        </div>
        <div className="hero-note"><span className="status-mark" aria-hidden="true" /><p>Live catalog, honest stock, retained order history.</p><small>{health.isPending ? "Connecting to the shop…" : health.error ? "The shop is temporarily unavailable." : "The shop is online."}</small></div>
      </div>
      <div className="feature-grid">
        <article className="feature-card"><span className="feature-number">01</span><h2>Browse with context</h2><p>Search, sort, and filter by category or availability without losing your place.</p></article>
        <article className="feature-card"><span className="feature-number">02</span><h2>Buy with confidence</h2><p>Prices and stock are checked again at checkout, and your address is retained with the order.</p></article>
        <article className="feature-card"><span className="feature-number">03</span><h2>Keep the record</h2><p>Orders, delivery, returns, and reviews stay connected to the identity that made them.</p></article>
      </div>
    </section>
  );
}
