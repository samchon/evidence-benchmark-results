/* Native controls are rendered by the design-system Button wrapper. */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import * as api from "@benchmark/shopping-api";
import { useState, type ReactNode } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Button, Card, EmptyState, ErrorState, Field, LoadingState, PageHeader, SelectField, Stat, StatusPill } from "@/components/ui";
import { formatDate, formatMoney, formatPrice, toErrorMessage } from "@/lib/utils";
import { useAddresses, useCatalog, useCategories, useCart, useCategoryProducts, useCustomerApplications, useCustomerProfile, useOrder, useOrders, useProduct, useShoppingOperations, useWishlist } from "@/lib/shopping/hooks";

function ProductCard(props: { product: api.IShoppingProduct.ISummary; onSave?: () => void }) {
  const product = props.product;
  return <Card className="product-card"><div className="product-thumb">{product.thumbnail === null ? <span>No image</span> : <img src={product.thumbnail.url} alt="" />}</div><div className="product-card-copy"><div className="split"><span className="kicker">{product.category?.name ?? "Uncategorized"}</span><StatusPill value={product.available ? "Available" : "Unavailable"} tone={product.available ? "good" : "warn"} /></div><h3><Link to={`/app/product/${product.id}`}>{product.name}</Link></h3><p className="muted"><Link to={`/app/seller/${product.seller.id}`}>{product.seller.shopName}</Link></p><strong className="price">{formatPrice(product.displayedPrice)}</strong><p className="muted">{product.averageRating === null ? "No reviews yet" : `${product.averageRating.toFixed(1)} / 5 · ${product.reviewCount} reviews`}</p>{props.onSave === undefined ? null : <Button tone="quiet" onClick={props.onSave}>Save to wishlist</Button>}</div></Card>;
}

function QueryState(props: { query: { isPending: boolean; error: unknown; refetch: () => unknown }; children: ReactNode; empty?: boolean; emptyTitle?: string; emptyDetail?: string }) {
  if (props.query.isPending) return <LoadingState />;
  if (props.query.error !== null && props.query.error !== undefined) return <ErrorState error={props.query.error} onRetry={() => void props.query.refetch()} />;
  if (props.empty === true) return <EmptyState title={props.emptyTitle ?? "Nothing here yet"} detail={props.emptyDetail ?? "Your next action will appear here."} />;
  return <>{props.children}</>;
}

function Pagination(props: { current: number; pages: number; onChange: (page: number) => void }) {
  return <div className="pagination"><Button tone="quiet" disabled={props.current <= 1} onClick={() => props.onChange(props.current - 1)}>Previous</Button><span>Page {props.current} of {Math.max(props.pages, 1)}</span><Button tone="quiet" disabled={props.current >= props.pages} onClick={() => props.onChange(props.current + 1)}>Next</Button></div>;
}

export function CustomerHomePage() {
  const profile = useCustomerProfile();
  const catalog = useCatalog({ page: 1, limit: 6 });
  const cart = useCart();
  const wishlist = useWishlist({ page: 1, limit: 1 });
  const operations = useShoppingOperations();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const save = async (id: string) => { if (busy) return; setBusy(true); setError(null); try { await operations.customer.wishlistAdd(id); setMessage("Saved to your wishlist."); } catch (caught) { setError(toErrorMessage(caught)); } finally { setBusy(false); } };
  const loading = profile.isPending || catalog.isPending || cart.isPending || wishlist.isPending;
  const queryError = profile.error ?? catalog.error ?? cart.error ?? wishlist.error;
  if (loading) return <section className="page"><LoadingState label="Loading customer workspace" /></section>;
  if (queryError !== null && queryError !== undefined) return <section className="page"><ErrorState error={queryError} onRetry={() => void Promise.all([profile.refetch(), catalog.refetch(), cart.refetch(), wishlist.refetch()])} /></section>;
  return <section className="page"><PageHeader eyebrow="Customer workspace" title={profile.data?.displayName ? `Good to see you, ${profile.data.displayName}.` : "Your commerce desk"} detail="Keep discovery, purchase, and after-sales work in one place." action={<Link className="button button-primary" to="/app/catalog">Browse catalog</Link>} /><div className="stat-grid"><Stat label="Cart total" value={cart.data === undefined ? "Not loaded" : formatMoney(cart.data.total)} detail={cart.data === undefined ? "Loading current lines" : `${cart.data.lines.length} saved lines`} /><Stat label="Wishlist" value={wishlist.data?.pagination.records ?? "Not loaded"} detail="Saved products" /><Stat label="Profile" value={profile.data === undefined ? "Loading" : "Ready"} detail="Personal identity" /></div><div className="section-heading"><div><p className="eyebrow">Fresh from the catalog</p><h2>Find something worth keeping</h2></div><Link to="/app/catalog">See all</Link></div><QueryState query={catalog} empty={catalog.data?.data.length === 0} emptyTitle="The catalog is quiet" emptyDetail="Try again when approved sellers have published products."><div className="product-grid">{catalog.data?.data.map((product) => <ProductCard product={product} key={product.id} onSave={() => void save(product.id)} />)}</div></QueryState>{error === null ? null : <p className="form-message error" role="alert">{error}</p>}{message === null ? null : <p className="form-message success" role="status">{message}</p>}</section>;
}

export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const sort = (params.get("sort") ?? "createdAt") as api.IShoppingProduct.IRequest["sort"];
  const categoryId = params.get("categoryId") ?? null;
  const minPrice = params.get("minPrice") ?? "";
  const maxPrice = params.get("maxPrice") ?? "";
  const inStock = params.get("inStock") === "true";
  const request: api.IShoppingProduct.IRequest = { page: Number(params.get("page") ?? 1), limit: 12, search: search === "" ? null : search, categoryId, minPrice: minPrice === "" ? null : Number(minPrice), maxPrice: maxPrice === "" ? null : Number(maxPrice), inStock, sort };
  const catalog = useCatalog(request, categoryId === null);
  const categoryProducts = useCategoryProducts(categoryId ?? "", request, categoryId !== null);
  const query = categoryId === null ? catalog : categoryProducts;
  const categories = useCategories();
  const operations = useShoppingOperations();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const save = async (id: string) => { if (busy) return; setBusy(true); setError(null); try { await operations.customer.wishlistAdd(id); } catch (caught) { setError(toErrorMessage(caught)); } finally { setBusy(false); } };
  const setFilter = (key: string, value: string) => setParams((current) => { if (value === "") current.delete(key); else current.set(key, value); current.set("page", "1"); return current; });
  if (categories.error !== null && categories.error !== undefined) return <section className="page"><ErrorState error={categories.error} onRetry={() => void categories.refetch()} /></section>;
  return <section className="page"><PageHeader eyebrow="Customer / catalog" title="Browse the live catalog" detail="Search across approved, visible sellers. Unavailable products remain legible so you can understand why they cannot be purchased." /><Card><div className="filter-row"><Field label="Search product names" value={search} onChange={(event) => setFilter("search", event.target.value)} placeholder="Try linen" /><SelectField label="Sort" value={sort ?? "createdAt"} onChange={(value) => setFilter("sort", value)} options={[{ label: "Newest", value: "createdAt" }, { label: "Price: low to high", value: "priceAsc" }, { label: "Price: high to low", value: "priceDesc" }]} /><SelectField label="Category" value={categoryId ?? ""} onChange={(value) => setFilter("categoryId", value)} options={[{ label: "All categories", value: "" }, ...(categories.data ?? []).flatMap((category) => [{ label: category.name, value: category.id }, ...category.children.map((child) => ({ label: `↳ ${child.name}`, value: child.id }))])]} /><Field label="Minimum price" type="number" min={0} value={minPrice} onChange={(event) => setFilter("minPrice", event.target.value)} /><Field label="Maximum price" type="number" min={0} value={maxPrice} onChange={(event) => setFilter("maxPrice", event.target.value)} /><label className="field"><span>In-stock only</span><input aria-label="In-stock only" type="checkbox" checked={inStock} onChange={(event) => setFilter("inStock", event.target.checked ? "true" : "")} /></label></div></Card><QueryState query={query} empty={query.data?.data.length === 0} emptyTitle="No products match this filter" emptyDetail="Change the search, category, or sort and try again."><div className="product-grid">{query.data?.data.map((product) => <ProductCard product={product} key={product.id} onSave={() => void save(product.id)} />)}</div><Pagination current={query.data?.pagination.current ?? 1} pages={query.data?.pagination.pages ?? 1} onChange={(value) => setParams((current) => { current.set("page", String(value)); return current; })} /></QueryState>{error === null ? null : <p className="form-message error" role="alert">{error}</p>}</section>;
}

export function ProductPage() {
  const { id = "" } = useParams();
  const query = useProduct(id);
  const operations = useShoppingOperations();
  const [quantity, setQuantity] = useState(1);
  const [variantId, setVariantId] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (query.isPending) return <section className="page"><LoadingState /></section>;
  if (query.error !== null && query.error !== undefined) return <section className="page"><ErrorState error={query.error} onRetry={() => void query.refetch()} /></section>;
  const product = query.data;
  if (product === undefined) return <section className="page"><EmptyState title="Product not found" detail="This product is no longer available in live commerce." /></section>;
  const variant = product.variants.find((item) => item.id === variantId);
  const runProductAction = async (action: () => Promise<unknown>, success: string) => { if (busy) return; setBusy(true); setError(null); setNotice(null); try { await action(); setNotice(success); } catch (caught) { setError(toErrorMessage(caught)); } finally { setBusy(false); } };
  return <section className="page"><Link className="back-link" to="/app/catalog">Back to catalog</Link><div className="detail-grid"><Card className="detail-gallery"><div className="hero-image">{product.images[0] === undefined ? "No image" : <img src={product.images[0].url} alt="" />}</div><div className="thumbnail-row">{product.images.map((image) => <img src={image.url} alt="" key={image.id} />)}</div></Card><div className="detail-copy"><p className="eyebrow">{product.category?.name ?? "Uncategorized"}</p><h1>{product.name}</h1><p className="muted"><Link to={`/app/seller/${product.seller.id}`}>View {product.seller.shopName}'s public shop</Link></p><p className="lede">{product.description}</p><p className="price large">{formatPrice(product.displayedPrice)}</p><p>{product.averageRating === null ? "No reviews yet" : `${product.averageRating.toFixed(1)} / 5 from ${product.reviewCount} reviews`}</p><label className="field"><span>Variant</span><select value={variant?.id ?? ""} onChange={(event) => setVariantId(event.target.value)} disabled={product.variants.length === 0}><option value="">Choose a variant</option>{product.variants.map((item) => <option value={item.id} key={item.id}>{item.sku} · {Object.entries(item.options).map(([key, value]) => `${key}: ${value}`).join(", ")} · {formatMoney(item.price)} · {item.available ? `${item.stock} in stock` : "Out of stock"}</option>)}</select></label><Field label="Quantity" type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /><div className="button-row"><Button disabled={variant === undefined || variant.available === false} onClick={() => void runProductAction(() => operations.customer.cartAdd(variant?.id ?? "", { quantity }), "Added to cart. Your current price will be checked again at checkout.")}>Add to cart</Button><Button tone="quiet" onClick={() => void runProductAction(() => operations.customer.wishlistAdd(product.id), "Saved to your wishlist.")}>Save product</Button></div>{error === null ? null : <p className="form-message error" role="alert">{error}</p>}{notice === null ? null : <p className="form-message success" role="status">{notice}</p>}</div></div><section className="detail-section"><div className="section-heading"><div><p className="eyebrow">Verified feedback</p><h2>Reviews</h2></div></div>{product.reviews.length === 0 ? <EmptyState title="No reviews yet" detail="Verified feedback will appear after a delivered purchase." /> : <div className="review-list">{product.reviews.map((review) => <Card key={review.id}><div className="split"><strong>{review.rating} / 5</strong><span className="muted">{formatDate(review.publishedAt)}</span></div><p>{review.text ?? "No written comment."}</p><p className="muted">{review.author.displayName}</p></Card>)}</div>}</section></section>;
}

export function CartPage() {
  const cart = useCart();
  const addresses = useAddresses();
  const operations = useShoppingOperations();
  const navigate = useNavigate();
  const [addressId, setAddressId] = useState("");
  const [summary, setSummary] = useState<api.IShoppingOrder.ICheckoutSummary | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  if (cart.isPending) return <section className="page"><LoadingState /></section>;
  if (cart.error !== null && cart.error !== undefined) return <section className="page"><ErrorState error={cart.error} onRetry={() => void cart.refetch()} /></section>;
  const lines = cart.data?.lines ?? [];
  const resetSummary = () => { setSummary(null); setMessage(null); };
  return <section className="page"><PageHeader eyebrow="Customer / cart" title="Your cart" detail="Cart values stay current and unavailable lines stay visible until you correct or remove them." action={<Link className="button button-quiet" to="/app/catalog">Continue shopping</Link>} />{lines.length === 0 ? <EmptyState title="Your cart is empty" detail="Choose a specific in-stock variant from the catalog." /> : <div className="split-layout"><div className="stack">{lines.map((line) => <Card key={line.id} className={line.available && !line.shortage ? "" : "line-unavailable"}><div className="split"><div><h2>{line.variant.product.name}</h2><p className="muted">{line.variant.sku} · {Object.entries(line.variant.options).map(([key, value]) => `${key}: ${value}`).join(", ")}</p></div><StatusPill value={line.available ? line.shortage ? "Short on stock" : "Ready" : "Unavailable"} tone={line.available ? line.shortage ? "warn" : "good" : "bad"} /></div><div className="line-controls"><Field label="Quantity" type="number" min={1} value={line.quantity} onChange={(event) => { resetSummary(); void operations.customer.cartUpdate(line.id, { quantity: Number(event.target.value) }); }} /><strong>{formatMoney(line.subtotal)}</strong><Button tone="quiet" onClick={() => { resetSummary(); void operations.customer.cartDelete(line.id); }}>Remove</Button></div></Card>)}</div><Card className="checkout-card"><p className="eyebrow">Checkout</p><h2>Review eligible lines</h2><p className="muted">{cart.data?.lines.filter((line) => line.available && !line.shortage).length ?? 0} lines are currently eligible.</p><SelectField label="Shipping address" value={addressId} onChange={(value) => { resetSummary(); setAddressId(value); }} options={[{ label: "Choose a saved address", value: "" }, ...(addresses.data?.data ?? []).map((address) => ({ label: `${address.recipientName} · ${address.city}${address.isDefault ? " · default" : ""}`, value: address.id }))]} /><Button disabled={addressId === ""} onClick={() => { resetSummary(); void operations.customer.checkout({ addressId }).then(setSummary).catch((error: unknown) => setMessage(toErrorMessage(error))); }}>Start checkout</Button>{summary === null ? null : <div className="summary"><h3>Confirm this purchase</h3><div className="stack">{summary.items.map((item) => <div className="request-row" key={item.id}><div><strong>{item.productName}</strong><small>{item.seller.shopName} · {item.variantSku} · {Object.entries(item.variantOptions).map(([key, value]) => `${key}: ${value}`).join(", ")}</small></div><span>{item.quantity} × {formatMoney(item.unitPrice)} = {formatMoney(item.quantity * item.unitPrice)}</span></div>)}</div><p><strong>Total {formatMoney(summary.totalPrice)}</strong></p><p className="muted">Shipping to {summary.address.recipientName} · {summary.address.recipientPhone}<br />{summary.address.streetAddress}, {summary.address.city}, {summary.address.stateOrProvince} {summary.address.postalCode}, {summary.address.country}</p><Button onClick={() => void operations.customer.payment({ attemptId: summary.attemptId, success: true, amount: summary.totalPrice }).then(() => void navigate("/app/orders")).catch((error: unknown) => setMessage(toErrorMessage(error)))}>Confirm payment</Button></div>}{message === null ? null : <p className="form-message error" role="alert">{message}</p>}</Card></div>}</section>;
}

export function OrdersPage() {
  const [params, setParams] = useSearchParams();
  const query = useOrders({ page: Number(params.get("page") ?? 1), limit: 10 });
  return <section className="page"><PageHeader eyebrow="Customer / history" title="Orders" detail="Purchase-time facts remain readable even when live catalog or account records change." /><QueryState query={query} empty={query.data?.data.length === 0} emptyTitle="No orders yet" emptyDetail="A completed checkout will appear here."><div className="table-card"><table><thead><tr><th>Order</th><th>Purchased</th><th>Total</th><th>Status</th><th /></tr></thead><tbody>{query.data?.data.map((order) => <tr key={order.id}><td><Link to={`/app/orders/${order.id}`}>{order.orderNumber}</Link></td><td>{formatDate(order.purchasedAt)}</td><td>{formatMoney(order.totalPrice)}</td><td><StatusPill value={order.status} tone={order.status === "paid" ? "warn" : order.status === "delivered" ? "good" : "neutral"} /></td><td><Link to={`/app/orders/${order.id}`}>Open</Link></td></tr>)}</tbody></table></div><Pagination current={query.data?.pagination.current ?? 1} pages={query.data?.pagination.pages ?? 1} onChange={(page) => setParams({ page: String(page) })} /></QueryState></section>;
}

export function OrderPage() {
  const { id = "" } = useParams();
  const query = useOrder(id);
  if (query.isPending) return <section className="page"><LoadingState /></section>;
  if (query.error !== null && query.error !== undefined) return <section className="page"><ErrorState error={query.error} onRetry={() => void query.refetch()} /></section>;
  const order = query.data;
  return order === undefined ? <section className="page"><EmptyState title="Order not found" detail="This order is not available to the signed-in customer." /></section> : <section className="page"><PageHeader eyebrow="Customer / order detail" title={order.orderNumber} detail={`${formatDate(order.purchasedAt)} · ${formatMoney(order.totalPrice)}`} action={<StatusPill value={order.status} />} /><Card><Link to={`/app/orders/${order.id}`}>Open full order detail</Link></Card></section>;
}

export function ProfilePage() {
  const query = useCustomerProfile();
  const operations = useShoppingOperations();
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (query.isPending) return <section className="page"><LoadingState /></section>;
  if (query.error !== null && query.error !== undefined) return <section className="page"><ErrorState error={query.error} onRetry={() => void query.refetch()} /></section>;
  const profile = query.data;
  return <section className="page"><PageHeader eyebrow="Customer / profile" title="Personal profile" detail="Your profile is separate from credentials and commercial history." /><Card className="form-card"><Field label="Display name" value={displayName || profile?.displayName || ""} onChange={(event) => setDisplayName(event.target.value)} /><Field label="Phone number" value={phoneNumber || profile?.phoneNumber || ""} onChange={(event) => setPhoneNumber(event.target.value)} /><Button disabled={busy} onClick={() => { if (busy) return; setBusy(true); setError(null); setMessage(null); void operations.customer.profileUpdate({ displayName: displayName || profile?.displayName || "", phoneNumber: phoneNumber || profile?.phoneNumber || "" }).then(() => setMessage("Profile updated.")).catch((caught: unknown) => setError(toErrorMessage(caught))).finally(() => setBusy(false)); }}>{busy ? "Saving..." : "Save profile"}</Button>{error === null ? null : <p className="form-message error" role="alert">{error}</p>}{message === null ? null : <p className="form-message success" role="status">{message}</p>}</Card></section>;
}

export function AddressesPage() {
  const query = useAddresses();
  const operations = useShoppingOperations();
  const [form, setForm] = useState<api.IShoppingShippingAddress.ICreate>({ recipientName: "", recipientPhone: "", streetAddress: "", city: "", stateOrProvince: "", postalCode: "", country: "" });
  if (query.isPending) return <section className="page"><LoadingState /></section>;
  if (query.error !== null && query.error !== undefined) return <section className="page"><ErrorState error={query.error} onRetry={() => void query.refetch()} /></section>;
  return <section className="page"><PageHeader eyebrow="Customer / delivery" title="Saved addresses" detail="Keep complete destinations here; checkout copies the selected values into order history." /><div className="split-layout"><div className="stack">{query.data?.data.map((address) => <Card key={address.id}><div className="split"><h2>{address.recipientName}</h2>{address.isDefault ? <StatusPill value="Default" tone="good" /> : null}</div><p>{address.recipientPhone}</p><p>{address.streetAddress}, {address.city}, {address.stateOrProvince} {address.postalCode}, {address.country}</p><div className="button-row">{address.isDefault ? null : <Button tone="quiet" onClick={() => void operations.customer.addressDefault(address.id)}>Make default</Button>}<Button tone="danger" onClick={() => void operations.customer.addressDelete(address.id)}>Delete</Button></div></Card>)}</div><Card className="form-card"><h2>Add address</h2>{(Object.keys(form) as (keyof typeof form)[]).map((key) => <Field label={key.replace(/([A-Z])/g, " $1")} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} key={key} required />)}<Button onClick={() => void operations.customer.addressCreate(form).then(() => setForm({ recipientName: "", recipientPhone: "", streetAddress: "", city: "", stateOrProvince: "", postalCode: "", country: "" }))}>Save address</Button></Card></div></section>;
}

export function WishlistPage() {
  const [page, setPage] = useState(1);
  const query = useWishlist({ page, limit: 20 });
  const operations = useShoppingOperations();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const remove = async (id: string) => { if (busy) return; setBusy(true); setMessage(null); try { await operations.customer.wishlistDelete(id); setMessage("Product removed from your wishlist."); } catch (caught) { setMessage(toErrorMessage(caught)); } finally { setBusy(false); } };
  if (query.isPending) return <section className="page"><LoadingState /></section>;
  if (query.error !== null && query.error !== undefined) return <section className="page"><ErrorState error={query.error} onRetry={() => void query.refetch()} /></section>;
  return <section className="page"><PageHeader eyebrow="Customer / saved" title="Wishlist" detail="Saved products remain yours until you remove them; availability is always current." /><QueryState query={query} empty={query.data?.data.length === 0} emptyTitle="Your wishlist is empty" emptyDetail="Save a product from its card or detail view."><div className="product-grid">{query.data?.data.map((entry) => <div className="wishlist-entry" key={entry.id}><ProductCard product={entry.product} /><Button tone="quiet" onClick={() => void remove(entry.product.id)}>Remove from wishlist</Button></div>)}</div><Pagination current={query.data?.pagination.current ?? page} pages={query.data?.pagination.pages ?? 1} onChange={setPage} /></QueryState>{message === null ? null : <p className="form-message" role="status">{message}</p>}</section>;
}

export function ApplicationsPage() {
  const [page, setPage] = useState(1);
  const query = useCustomerApplications({ page, limit: 20 });
  const operations = useShoppingOperations();
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const apply = async () => { if (busy) return; setBusy(true); setMessage(null); try { await operations.customer.applicationApply({ reason }); setMessage("Application submitted."); } catch (caught) { setMessage(toErrorMessage(caught)); } finally { setBusy(false); } };
  return <section className="page"><PageHeader eyebrow="Customer / governance" title="Administrator applications" detail="Applications belong to your identity and retain every prior decision." action={<div className="button-row"><Field label="Reason" value={reason} onChange={(event) => setReason(event.target.value)} /><Button disabled={reason.trim() === ""} onClick={() => void apply()}>Apply</Button></div>} /><QueryState query={query} empty={query.data?.data.length === 0} emptyTitle="No applications" emptyDetail="A non-administrator can submit one when ready."><div className="stack">{query.data?.data.map((application) => <Card key={application.id}><div className="split"><h2>{application.status}</h2><span>{formatDate(application.createdAt)}{application.decidedAt === null ? "" : ` - decided ${formatDate(application.decidedAt)}`}</span></div><p>{application.reason}</p></Card>)}</div><Pagination current={query.data?.pagination.current ?? page} pages={query.data?.pagination.pages ?? 1} onChange={setPage} /></QueryState>{message === null ? null : <p className="form-message" role="status">{message}</p>}</section>;
}
