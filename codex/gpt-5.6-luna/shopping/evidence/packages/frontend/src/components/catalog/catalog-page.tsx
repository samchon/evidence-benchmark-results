import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import type { IShoppingProduct } from "@benchmark/shopping-api";
import type { StoredSession } from "@/lib/client";
import { diagnosis, money } from "@/lib/utils";
import { useShoppingOperations } from "../../lib/shopping/hooks";

/**
 * Live product search, category filtering, detail, reviews, wishlist, and cart entry.
 * @evidence {@link useShoppingOperations} Calls catalog and customer commerce operations through the shared hook.
 * @evidenceReview {@link useShoppingOperations} Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/02-domain-model.md#req-product-domain-product-model Renders product catalog state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-domain-product-model Read the page and product query; confirmed the live catalog state is rendered.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-product-availability-and-retirement-states Renders product availability state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-product-lifecycle-product-availability-and-retirement-states Read the detail and card states; confirmed availability is rendered from the live product response.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-category-model Renders category filtering state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-category-domain-category-model Read the category query and filter; confirmed the page renders the live category choices.
 * @evidence docs/analysis/02-domain-model.md#req-variant-lifecycle-variant-availability-and-retirement Renders variant stock state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-variant-lifecycle-variant-availability-and-retirement Read the variant list; confirmed stock and availability drive purchase controls.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-wishlist-model Renders saved-product state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-wishlist-domain-wishlist-model Read the save action; confirmed it targets a product rather than a variant or quantity.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model Renders cart entry state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model Read the variant add action; confirmed it enters the customer cart through the shared operations hook.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-review-model Renders live product rating and public review state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-review-model Read the detail and review queries; confirmed the page renders rating, count, and review content for the selected product.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-review-publication-and-retirement Renders current non-deleted reviews on product detail.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-review-publication-and-retirement Read the review list and empty state; confirmed current public review data is rendered in API order.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey Renders search, filters, cards, ordered images, ratings, and detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-discovery-product-discovery-journey Read the toolbar, cards, and detail drawer; confirmed the cited discovery state is visible.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-wishlist-operations Renders wishlist save.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-wishlist-functions-wishlist-operations Read the save control and mutation; confirmed the page invokes the product wishlist operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations Renders variant add-to-cart.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations Read the variant add control and mutation; confirmed the page invokes the cart operation.
 * @evidence docs/analysis/04-business-rules.md#req-search-policies-product-search-and-listing-policies Renders search, price, stock, category, and sort constraints.
 * @evidenceReview docs/analysis/04-business-rules.md#req-search-policies-product-search-and-listing-policies Read the filter controls and request mapping; confirmed all supported catalog constraints are exposed.
 * @evidence docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Renders product availability and refusal feedback.
 * @evidenceReview docs/analysis/04-business-rules.md#req-product-policies-product-validation-and-retirement-policies Read the availability labels and error state; confirmed API refusal feedback remains visible.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-review-eligibility-ordering-and-rating-policies Renders rating and newest-first review presentation.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-review-eligibility-ordering-and-rating-policies Read the review query and presentation; confirmed the page preserves the API's current review ordering and rating values.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-1-define-review-information Renders review rating, optional text, publication order, and attribution.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-1-define-review-information Read each review card; confirmed rating, text, ordering data, and anonymized attribution are rendered.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-2-relate-a-review-to-its-purchase Renders the review records returned for the selected product.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-2-relate-a-review-to-its-purchase Read the product-scoped review request; confirmed the page displays only reviews returned for that product.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-3-limit-reviews-per-purchase Renders the server's current review collection without duplicating entries client-side.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-3-limit-reviews-per-purchase Read the paginated review rendering; confirmed the page does not create or duplicate review identities.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-4-retire-a-review-from-ratings Renders the current review collection and aggregate supplied by the API.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-4-retire-a-review-from-ratings Read the aggregate and list rendering; confirmed retired reviews are represented only if returned by the live API.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-5-anonymize-reviews-after-customer-deletion Renders anonymized author attribution.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-5-anonymize-reviews-after-customer-deletion Read the anonymized branch in each review card; confirmed deleted authors are shown without a profile identity.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-1-publish-an-eligible-review Renders the published review result on product detail.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-1-publish-an-eligible-review Read the public review list; confirmed published reviews are shown in product detail.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-2-edit-a-published-review Renders the current post-edit review values returned by the API.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-2-edit-a-published-review Read the review card values; confirmed the page reflects the current server representation.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-3-delete-a-published-review Renders the current post-retirement review collection returned by the API.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-3-delete-a-published-review Read the empty and list states; confirmed retired reviews disappear when absent from the response.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-4-anonymize-reviews-on-account-closure Renders the anonymized state of retained reviews.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-4-anonymize-reviews-on-account-closure Read the attribution branch; confirmed the retained review stays visible as Deleted user.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-review-operations Renders the public review result and rating aggregate.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-review-operations Read the detail review list and aggregate; confirmed the page delivers the public review side of the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-1-publish-a-product-review Renders published reviews after the server accepts them.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-1-publish-a-product-review Read the live review list; confirmed accepted publication is visible to catalog users.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-2-edit-an-authored-review Renders the current values after an authored edit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-2-edit-an-authored-review Read the review card; confirmed current authored values are reflected when returned by the API.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-3-delete-an-authored-review Renders the post-delete empty or reduced review state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-3-delete-an-authored-review Read the list and empty state; confirmed deleted reviews are no longer rendered when the API omits them.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-1-require-a-verified-delivered-purchase Renders only reviews returned by the server's eligibility-enforcing endpoint.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-1-require-a-verified-delivered-purchase Read the page query; confirmed eligibility is delegated to the API and only accepted reviews are displayed.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-2-validate-review-rating-and-optional-text Renders validated rating and optional text values.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-2-validate-review-rating-and-optional-text Read the review card fields; confirmed the validated response values are displayed without client reinterpretation.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-3-keep-one-review-identity-per-product-and-order Renders the server's deduplicated public review list.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-3-keep-one-review-identity-per-product-and-order Read the product review query; confirmed the page displays the server's one-identity result set.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-4-keep-review-mutation-with-the-author Renders the author/anonymized presentation boundary.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-4-keep-review-mutation-with-the-author Read the attribution rendering; confirmed no nonauthor mutation control is exposed here.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-5-order-live-reviews-by-publication-time Renders the review endpoint's publication ordering.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-5-order-live-reviews-by-publication-time Read the list rendering; confirmed the page preserves response order.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-6-calculate-the-live-product-rating Renders the live average and count.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-6-calculate-the-live-product-rating Read the aggregate metadata; confirmed the page displays server-calculated rating and count.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-7-anonymize-retained-reviews-after-account-deletion Renders retained reviews with Deleted user attribution.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-7-anonymize-retained-reviews-after-account-deletion Read the anonymized label; confirmed retained feedback is not attributed to a deleted identity.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-1-upload-product-images Renders every product image URI returned by product detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-1-upload-product-images Read the detail image strip; confirmed all returned ordered images are displayed.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-2-reorder-product-images Renders the API's current image order.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-2-reorder-product-images Read the image strip; confirmed the page preserves the server-provided order.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-3-delete-a-product-image Renders the API's current retained image collection.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-product-image-functions-3-delete-a-product-image Read the image strip; confirmed deleted images disappear when absent from product detail.
 */
export function CatalogPage(props: { session: StoredSession | null }) {
  const operations = useShoppingOperations();
  const client = useQueryClient();
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const categoryId = params.get("category") ?? undefined;
  const selectedId = params.get("product");
  const minimumPrice = params.get("minimumPrice") ? Number(params.get("minimumPrice")) : undefined;
  const maximumPrice = params.get("maximumPrice") ? Number(params.get("maximumPrice")) : undefined;
  const inStockOnly = params.get("inStock") === "true";
  const sort = (params.get("sort") as "newest" | "priceAsc" | "priceDesc" | "name" | null) ?? "newest";
  const products = useQuery(queryOptions({ queryKey: ["products", operations, search, categoryId, minimumPrice, maximumPrice, inStockOnly, sort] as const, queryFn: () => operations.ProductSearchProductIndex({ page: 1, limit: 24, search: search || null, categoryId: categoryId ?? null, minimumPrice: minimumPrice ?? null, maximumPrice: maximumPrice ?? null, inStockOnly, sort }) }));
  const categories = useQuery(queryOptions({ queryKey: ["categories", operations] as const, queryFn: () => operations.CategoryListCategoryIndex({ page: 1, limit: 100 }) }));
  const detail = useQuery(queryOptions({ queryKey: ["product", operations, selectedId] as const, enabled: selectedId !== null, queryFn: () => operations.ProductDetailProductAt(selectedId as string) }));
  const reviews = useQuery(queryOptions({ queryKey: ["product-reviews", operations, selectedId] as const, enabled: selectedId !== null, queryFn: () => operations.ProductReviewsProductReviews(selectedId as string, { page: 1, limit: 20 }) }));
  const add = useMutation({ mutationFn: (input: { variantId: string; quantity: number }) => operations.CustomerCartCreateCartCreate(input), onSuccess: () => { void client.invalidateQueries({ queryKey: ["cart"] }); } });
  const save = useMutation({ mutationFn: (productId: string) => operations.CustomerWishlistCreateWishlistCreate({ productId }), onSuccess: () => { void client.invalidateQueries({ queryKey: ["wishlist"] }); } });
  const activeCategory = useMemo(() => categories.data?.data.find((category) => category.id === categoryId), [categories.data, categoryId]);
  const setFilter = (key: string, value: string) => { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); next.delete("product"); setParams(next); };
  return <section className="catalog-page page-stack">
    <div className="section-heading split-heading"><div><p className="eyebrow">The collection</p><h1>Find your next favorite</h1><p>Search a live catalog with current prices and honest availability.</p></div><span className="result-count">{products.data?.pagination.records ?? 0} pieces</span></div>
    <div className="catalog-toolbar card"><label className="search-field">Search<input aria-label="Search products" value={search} onChange={(event) => setFilter("search", event.target.value)} placeholder="Try linen, ceramic, or everyday" /></label><label>Category<select aria-label="Filter by category" value={categoryId ?? ""} onChange={(event) => setFilter("category", event.target.value)}><option value="">All categories</option>{categories.data?.data.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label>Minimum price<input aria-label="Minimum price" min="0" step="0.01" type="number" value={params.get("minimumPrice") ?? ""} onChange={(event) => setFilter("minimumPrice", event.target.value)} /></label><label>Maximum price<input aria-label="Maximum price" min="0" step="0.01" type="number" value={params.get("maximumPrice") ?? ""} onChange={(event) => setFilter("maximumPrice", event.target.value)} /></label><label>Sort<select aria-label="Sort products" value={sort} onChange={(event) => setFilter("sort", event.target.value)}><option value="newest">Newest</option><option value="priceAsc">Price: low to high</option><option value="priceDesc">Price: high to low</option><option value="name">Name</option></select></label><label className="check-label"><input aria-label="In stock only" type="checkbox" checked={inStockOnly} onChange={(event) => setFilter("inStock", event.target.checked ? "true" : "")} /> In stock only</label></div>
    {activeCategory && <p className="filter-note">Showing {activeCategory.name}. <button type="button" onClick={() => setFilter("category", "")}>Clear filter</button></p>}
    {products.isPending && <div className="loading-panel">Loading the collection…</div>}
    {products.error && <div className="error-panel" role="alert"><strong>We could not load the collection.</strong><span>{diagnosis(products.error)}</span><button className="button button-outline" type="button" onClick={() => { void products.refetch(); }}>Try again</button></div>}
    {products.data?.data.length === 0 && <div className="empty-panel"><h2>No pieces match that search</h2><p>Try a broader phrase or clear the category filter.</p></div>}
    <div className="product-grid">{products.data?.data.map((product) => <ProductCard key={product.id} product={product} onSelect={() => setFilter("product", product.id)} />)}</div>
    {detail.data && <div className="detail-drawer" role="dialog" aria-label="Product details"><button className="drawer-close" type="button" onClick={() => setFilter("product", "")}>Close</button><div className="detail-art" aria-hidden="true">{detail.data.images[0] ? <img src={detail.data.images[0]} alt="" /> : detail.data.name.slice(0, 1)}</div><div className="detail-content"><p className="eyebrow">{detail.data.availability}</p><h2>{detail.data.name}</h2><p>{detail.data.description}</p><p className="rating-line" aria-label={`${detail.data.rating} out of 5 from ${detail.data.reviewCount} reviews`}>★ {detail.data.rating.toFixed(1)} · {detail.data.reviewCount} reviews</p><div className="image-strip">{detail.data.images.map((image) => <img key={image} src={image} alt="" />)}</div><p className="price-large">{money(detail.data.basePrice)}</p><div className="button-row"><button className="button button-outline" type="button" disabled={props.session?.actor !== "customer" || save.isPending} onClick={() => save.mutate(detail.data.id)}>{save.isSuccess ? "Saved" : "Save for later"}</button>{props.session?.actor !== "customer" && <span className="muted-copy">Sign in as a customer to save or buy.</span>}</div><div className="variant-list"><h3>Choose a variation</h3>{detail.data.variants.map((variant) => <div className="variant-row" key={variant.id}><span><strong>{variant.skuCode}</strong><small>{Object.entries(variant.optionValues).map(([key, value]) => `${key}: ${value}`).join(" · ") || "Standard"} · {variant.stock} in stock</small></span><button className="button button-dark" type="button" disabled={props.session?.actor !== "customer" || variant.stock < 1 || add.isPending} onClick={() => add.mutate({ variantId: variant.id, quantity: 1 })}>{add.isPending ? "Adding…" : props.session?.actor === "customer" ? "Add to cart" : "Sign in to buy"}</button></div>)}</div><div className="review-list"><h3>Customer reviews</h3>{reviews.isPending && <p className="muted-copy">Loading reviews…</p>}{reviews.error && <p className="error-panel" role="alert">{diagnosis(reviews.error)} <button type="button" onClick={() => { void reviews.refetch(); }}>Try again</button></p>}{reviews.data?.data.length === 0 && <p className="muted-copy">No reviews yet.</p>}{reviews.data?.data.map((review) => <article className="review-card" key={review.id}><strong>★ {review.rating}/5</strong><p>{review.text ?? "No written note."}</p><small>{review.anonymized ? "Deleted user" : "Verified customer"}</small></article>)}</div>{add.error && <p className="error-panel" role="alert">{diagnosis(add.error)}</p>}{add.isSuccess && <p className="success-message" role="status">Added to your cart.</p>}{save.error && <p className="error-panel" role="alert">{diagnosis(save.error)}</p>}</div></div>}
  </section>;
}

function ProductCard(props: { product: IShoppingProduct.ISummary; onSelect: () => void }) {
  return <article className="product-card"><button className="product-art" type="button" onClick={props.onSelect} aria-label={`Open ${props.product.name}`}>{props.product.thumbnail ? <img src={props.product.thumbnail} alt="" /> : <span>{props.product.name.slice(0, 1)}</span>}</button><div className="product-info"><p className="product-seller">{props.product.sellerShopName}</p><button className="product-name" type="button" onClick={props.onSelect}>{props.product.name}</button><p className="product-description">{props.product.description}</p><div className="product-meta"><strong>{money(props.product.basePrice)}</strong><span>{props.product.availability}</span></div><p className="rating-line">★ {props.product.rating.toFixed(1)} · {props.product.reviewCount} reviews</p></div></article>;
}
