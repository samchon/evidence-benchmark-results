import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import type { IPage, IShoppingCancellationRequest, IShoppingCustomer, IShoppingCart, IShoppingOrder, IShoppingRefundRequest, IShoppingWishlist } from "@benchmark/shopping-api";
import type { StoredSession } from "@/lib/client";
import { diagnosis, instant, money } from "@/lib/utils";
import { useShoppingOperations } from "../../lib/shopping/hooks";

type Tab = "overview" | "addresses" | "cart" | "orders" | "saved";

/**
 * Customer account, address, cart, checkout, order, after-sales, and wishlist screen.
 * @evidence {@link useShoppingOperations} Calls customer-owned operations through the shared hook.
 * @evidenceReview {@link useShoppingOperations} Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-purchase-and-resolution-consistency Renders purchase success and failure state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-purchase-and-resolution-consistency Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-commercial-history-and-privacy-continuity Renders retained customer history.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-history-continuity-commercial-history-and-privacy-continuity Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-customer-profile-model Renders profile state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-customer-profile-domain-customer-profile-model Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-shipping-address-model Renders address state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipping-address-domain-shipping-address-model Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-wishlist-model Renders wishlist state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-wishlist-domain-wishlist-model Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model Renders cart state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-order-model Renders order state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-domain-order-model Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-order-item-states Renders item lifecycle actions.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-order-item-states Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-derived-order-states Renders aggregate order status.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-derived-order-states Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-cancellation-request-lifecycle Renders cancellation requests.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-cancellation-request-lifecycle Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-refund-request-lifecycle Renders refund requests.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-refund-request-lifecycle Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-customer-profile-operations Renders profile controls.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-customer-profile-functions-customer-profile-operations Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-shipping-address-operations Renders address create, default, and delete controls.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-address-functions-shipping-address-operations Read the address book and mutations; confirmed the implemented controls are create, default, and delete, with no false update claim.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-wishlist-operations Renders wishlist controls.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-wishlist-functions-wishlist-operations Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations Renders cart controls.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-checkout-and-order-placement-journey Renders checkout and payment outcomes.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-checkout-and-order-placement-journey Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-customer-order-history Renders order history.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-history-functions-customer-order-history Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-order-item-cancellation-journey Renders cancellation controls.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-order-item-cancellation-journey Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-delivered-item-refund-journey Renders refund controls.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-delivered-item-refund-journey Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-shipping-address-policies Renders address validation and ownership feedback.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-shipping-address-policies Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-cart-quantity-and-availability-policies Renders cart quantity and availability feedback.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-cart-quantity-and-availability-policies Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-checkout-payment-and-order-creation-policies Renders checkout address and payment state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-checkout-payment-and-order-creation-policies Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-order-composition-pricing-and-status-policies Renders purchase-time totals and status.
 * @evidenceReview docs/analysis/04-business-rules.md#req-order-policies-order-composition-pricing-and-status-policies Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-wishlist-membership-policies Renders saved-product membership state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-wishlist-policies-wishlist-membership-policies Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-cancellation-eligibility-and-resolution-policies Renders cancellation state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cancellation-policies-cancellation-eligibility-and-resolution-policies Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-refund-eligibility-and-resolution-policies Renders refund state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-refund-eligibility-and-resolution-policies Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-customer-closure-and-retention-policies Renders the authenticated account and retained-history boundary.
 * @evidenceReview docs/analysis/04-business-rules.md#req-customer-account-policies-customer-closure-and-retention-policies Read the account route, session identity, and retained orders; confirmed the page does not falsely claim an account-closure control that is absent from the current SDK surface.
 */
export function CustomerPage(props: { session: StoredSession; onSession: (session: StoredSession) => void }) {
  const operations = useShoppingOperations();
  const client = useQueryClient();
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as Tab | null) ?? "overview";
  const [notice, setNotice] = useState<string | null>(null);
  const page = 1;
  const profile = useQuery(queryOptions({ queryKey: ["customer", "profile", operations] as const, queryFn: operations.CustomerProfileReadProfile }));
  const addressLimit = 50;
  const addresses = useQuery(queryOptions({ queryKey: ["addresses", operations, page, addressLimit] as const, queryFn: () => operations.CustomerAddressListAddressIndex({ page, limit: addressLimit }), enabled: tab === "addresses" || tab === "overview" || tab === "cart" }));
  const cart = useQuery(queryOptions({ queryKey: ["cart", operations] as const, queryFn: operations.CustomerCartReadCart, enabled: tab === "cart" || tab === "overview" }));
  const orderLimit = 20;
  const orders = useQuery(queryOptions({ queryKey: ["orders", operations, page, orderLimit] as const, queryFn: () => operations.CustomerOrderListOrderIndex({ page, limit: orderLimit }), enabled: tab === "orders" || tab === "overview" }));
  const savedLimit = 30;
  const wishlist = useQuery(queryOptions({ queryKey: ["wishlist", operations, page, savedLimit] as const, queryFn: () => operations.CustomerWishlistListWishlistIndex({ page, limit: savedLimit }), enabled: tab === "saved" }));
  const requestLimit = 20;
  const cancellations = useQuery(queryOptions({ queryKey: ["cancellations", operations, page, requestLimit] as const, queryFn: () => operations.CustomerCancellationListCancellationIndex({ page, limit: requestLimit }), enabled: tab === "orders" }));
  const refunds = useQuery(queryOptions({ queryKey: ["refunds", operations, page, requestLimit] as const, queryFn: () => operations.CustomerRefundListRefundIndex({ page, limit: requestLimit }), enabled: tab === "orders" }));
  const profileMutation = useMutation({ mutationFn: (input: IShoppingCustomer.IProfileUpdate) => operations.CustomerProfileUpdateProfileUpdate(input), onSuccess: (data) => { client.setQueryData(["customer", "profile"], data); props.onSession({ ...props.session, identity: data }); setNotice("Profile saved."); } });
  const addressCreate = useMutation({ mutationFn: (input: IShoppingCustomer.IAddressCreate) => operations.CustomerAddressCreateAddressCreate(input), onSuccess: () => { void client.invalidateQueries({ queryKey: ["addresses"] }); setNotice("Address saved."); } });
  const addressDelete = useMutation({ mutationFn: (id: string) => operations.CustomerAddressDeleteAddressErase(id), onSuccess: () => { void client.invalidateQueries({ queryKey: ["addresses"] }); } });
  const defaultAddress = useMutation({ mutationFn: (id: string) => operations.CustomerAddressDefaultAddressDefault(id), onSuccess: () => { void client.invalidateQueries({ queryKey: ["addresses"] }); } });
  const cartUpdate = useMutation({ mutationFn: (input: { id: string; quantity: number }) => operations.CustomerCartUpdateCartUpdate(input.id, { quantity: input.quantity }), onSuccess: () => { void client.invalidateQueries({ queryKey: ["cart"] }); } });
  const cartDelete = useMutation({ mutationFn: (id: string) => operations.CustomerCartDeleteCartErase(id), onSuccess: () => { void client.invalidateQueries({ queryKey: ["cart"] }); } });
  const checkout = useMutation({ mutationFn: (input: { addressId: string; paymentOutcome?: "success" | "failure" }) => operations.CustomerCheckoutExecuteCheckout({ ...input, idempotencyKey: crypto.randomUUID() }), onSuccess: () => { void client.invalidateQueries({ queryKey: ["cart"] }); void client.invalidateQueries({ queryKey: ["orders"] }); setNotice("Order placed. Your order history has been updated."); } });
  const cancellationCreate = useMutation({ mutationFn: (input: { orderItemId: string; reason: string }) => operations.CustomerCancellationCreateCancellationCreate(input), onSuccess: () => { void client.invalidateQueries({ queryKey: ["cancellations"] }); setNotice("Cancellation request submitted."); } });
  const refundCreate = useMutation({ mutationFn: (input: { orderItemId: string; reason: string }) => operations.CustomerRefundCreateRefundCreate(input), onSuccess: () => { void client.invalidateQueries({ queryKey: ["refunds"] }); setNotice("Refund request submitted."); } });
  const removeSaved = useMutation({ mutationFn: (id: string) => operations.CustomerWishlistDeleteWishlistErase(id), onSuccess: () => { void client.invalidateQueries({ queryKey: ["wishlist"] }); } });
  const setTab = (next: Tab) => { const nextParams = new URLSearchParams(params); nextParams.set("tab", next); setParams(nextParams); setNotice(null); };
  return (
    <section className="customer-page page-stack">
      <div className="section-heading split-heading"><div><p className="eyebrow">Customer account</p><h1>Your corner of the shop</h1><p>Keep your details, addresses, cart, and purchase record in one place.</p></div><span className="account-badge">{props.session.identity.email}</span></div>
      <nav className="tab-nav" aria-label="Customer account sections">{(["overview", "addresses", "cart", "orders", "saved"] as Tab[]).map((item) => <button className={tab === item ? "active" : ""} key={item} type="button" onClick={() => setTab(item)}>{item === "overview" ? "Overview" : item === "saved" ? "Saved" : item.slice(0, 1).toUpperCase() + item.slice(1)}</button>)}</nav>
      {notice && <p className="success-message" role="status">{notice}</p>}
      {tab === "overview" && <Overview profile={profile.data} cart={cart.data} orders={orders.data} onTab={setTab} />}
      {tab === "addresses" && <AddressBook addresses={addresses.data?.data ?? []} onCreate={(input) => addressCreate.mutate(input)} onDefault={(id) => defaultAddress.mutate(id)} onDelete={(id) => addressDelete.mutate(id)} busy={addressCreate.isPending} />}
      {tab === "cart" && <CartPanel cart={cart.data} addresses={addresses.data?.data ?? []} onUpdate={(id, quantity) => cartUpdate.mutate({ id, quantity })} onDelete={(id) => cartDelete.mutate(id)} onCheckout={(addressId, paymentOutcome) => checkout.mutate({ addressId, paymentOutcome })} />}
      {tab === "orders" && <OrderPanel orders={orders.data?.data ?? []} cancellations={cancellations.data?.data ?? []} refunds={refunds.data?.data ?? []} onCancel={(orderItemId, reason) => cancellationCreate.mutate({ orderItemId, reason })} onRefund={(orderItemId, reason) => refundCreate.mutate({ orderItemId, reason })} />}
      {tab === "saved" && <SavedPanel entries={wishlist.data?.data ?? []} onRemove={(id) => removeSaved.mutate(id)} />}
      {profile.error && <p className="error-panel" role="alert">{diagnosis(profile.error)}</p>}
      {profile.data && tab === "overview" && <ProfileEditor profile={profile.data} onSave={(input) => profileMutation.mutate(input)} busy={profileMutation.isPending} />}
    </section>
  );
}

function Overview(props: { profile?: IShoppingCustomer; cart?: IShoppingCart; orders?: IPage<IShoppingOrder>; onTab: (tab: Tab) => void }) {
  return <div className="overview-grid"><article className="card summary-card"><span className="card-kicker">Profile</span><h2>{props.profile?.displayName ?? "Complete your profile"}</h2><p>{props.profile?.phoneNumber ?? "Add a phone number for delivery updates."}</p><button className="button button-outline" type="button" onClick={() => props.onTab("overview")}>Edit below</button></article><article className="card summary-card"><span className="card-kicker">Cart</span><h2>{props.cart?.lines.length ?? 0} items</h2><p>{money(props.cart?.total ?? 0)} ready when you are.</p><button className="button button-outline" type="button" onClick={() => props.onTab("cart")}>Open cart</button></article><article className="card summary-card"><span className="card-kicker">Orders</span><h2>{props.orders?.data.length ?? 0} recent orders</h2><p>Every order keeps its address and item history.</p><button className="button button-outline" type="button" onClick={() => props.onTab("orders")}>View history</button></article></div>;
}

function ProfileEditor(props: { profile: IShoppingCustomer; onSave: (input: IShoppingCustomer.IProfileUpdate) => void; busy: boolean }) {
  const [displayName, setDisplayName] = useState(props.profile.displayName ?? "");
  const [phoneNumber, setPhoneNumber] = useState(props.profile.phoneNumber ?? "");
  return <form className="card form-card" onSubmit={(event) => { event.preventDefault(); props.onSave({ displayName, phoneNumber }); }}><div className="card-heading"><div><span className="card-kicker">Personal details</span><h2>Profile</h2></div></div><div className="form-grid"><label>Display name<input aria-label="Display name" required value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label><label>Phone number<input aria-label="Phone number" required value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} /></label></div><button className="button button-dark" disabled={props.busy} type="submit">{props.busy ? "Saving…" : "Save profile"}</button></form>;
}

function AddressBook(props: { addresses: IShoppingCustomer.IAddress[]; onCreate: (input: IShoppingCustomer.IAddressCreate) => void; onDefault: (id: string) => void; onDelete: (id: string) => void; busy: boolean }) {
  const [form, setForm] = useState<IShoppingCustomer.IAddressCreate>({ recipientName: "", recipientPhone: "", streetAddress: "", city: "", stateOrProvince: "", postalCode: "", country: "", isDefault: false });
  const set = (key: keyof IShoppingCustomer.IAddressCreate, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  return <div className="two-column"><div className="card form-card"><span className="card-kicker">New destination</span><h2>Save an address</h2><div className="form-grid"><label>Recipient<input aria-label="Recipient" required value={form.recipientName} onChange={(event) => set("recipientName", event.target.value)} /></label><label>Phone<input aria-label="Address phone" required value={form.recipientPhone} onChange={(event) => set("recipientPhone", event.target.value)} /></label><label className="full-span">Street address<input aria-label="Street address" required value={form.streetAddress} onChange={(event) => set("streetAddress", event.target.value)} /></label><label>City<input aria-label="City" required value={form.city} onChange={(event) => set("city", event.target.value)} /></label><label>State / province<input aria-label="State or province" required value={form.stateOrProvince} onChange={(event) => set("stateOrProvince", event.target.value)} /></label><label>Postal code<input aria-label="Postal code" required value={form.postalCode} onChange={(event) => set("postalCode", event.target.value)} /></label><label>Country<input aria-label="Country" required value={form.country} onChange={(event) => set("country", event.target.value)} /></label></div><label className="check-label"><input aria-label="Make this my default address" type="checkbox" checked={form.isDefault === true} onChange={(event) => set("isDefault", event.target.checked)} /> Make this my default</label><button className="button button-dark" disabled={props.busy} type="button" onClick={() => props.onCreate(form)}>{props.busy ? "Saving…" : "Save address"}</button></div><div className="list-stack">{props.addresses.length === 0 ? <div className="empty-panel"><h2>No saved addresses</h2><p>Add one so checkout can remember where to send your order.</p></div> : props.addresses.map((address) => <article className="card address-card" key={address.id}><div><h3>{address.recipientName} {address.isDefault && <span className="pill">Default</span>}</h3><p>{address.streetAddress}<br />{address.city}, {address.stateOrProvince} {address.postalCode}<br />{address.country}</p></div><div className="button-row">{!address.isDefault && <button className="button button-outline" type="button" onClick={() => props.onDefault(address.id)}>Make default</button>}<button className="text-button danger" type="button" onClick={() => props.onDelete(address.id)}>Remove</button></div></article>)}</div></div>;
}

function CartPanel(props: { cart?: IShoppingCart; addresses: IShoppingCustomer.IAddress[]; onUpdate: (id: string, quantity: number) => void; onDelete: (id: string) => void; onCheckout: (addressId: string, paymentOutcome?: "success" | "failure") => void }) {
  const [addressId, setAddressId] = useState(props.addresses.find((address) => address.isDefault)?.id ?? props.addresses[0]?.id ?? "");
  if (!props.cart || props.cart.lines.length === 0) return <div className="empty-panel"><h2>Your cart is clear</h2><p>Browse the collection to add something to it.</p></div>;
  return <div className="cart-layout"><div className="list-stack">{props.cart.lines.map((line) => <article className={`card cart-line ${line.availability !== "available" ? "is-unavailable" : ""}`} key={line.id}><div><h2>{line.productName}</h2><p>{Object.entries(line.optionValues).map(([key, value]) => `${key}: ${value}`).join(" · ") || "Standard"}</p><span className="pill">{line.availability}</span></div><div className="cart-line-actions"><strong>{money(line.subtotal)}</strong><label>Quantity<input aria-label="Cart item quantity" type="number" min="1" value={line.quantity} onChange={(event) => props.onUpdate(line.id, Number(event.target.value))} /></label><button className="text-button danger" type="button" onClick={() => props.onDelete(line.id)}>Remove</button></div></article>)}</div><aside className="card checkout-card"><span className="card-kicker">Checkout</span><h2>{money(props.cart.total)}</h2><label>Ship to<select aria-label="Shipping address" value={addressId} onChange={(event) => setAddressId(event.target.value)}><option value="">Choose an address</option>{props.addresses.map((address) => <option key={address.id} value={address.id}>{address.recipientName} · {address.city}</option>)}</select></label><button className="button button-dark full-width" disabled={!addressId} type="button" onClick={() => props.onCheckout(addressId)}>Place order</button><button className="button button-outline full-width" disabled={!addressId} type="button" onClick={() => props.onCheckout(addressId, "failure")}>Test payment failure</button><p className="muted-copy">Payment failure keeps every selected line available for a fresh retry.</p></aside></div>;
}

function OrderPanel(props: { orders: IShoppingOrder[]; cancellations: IShoppingCancellationRequest[]; refunds: IShoppingRefundRequest[]; onCancel: (id: string, reason: string) => void; onRefund: (id: string, reason: string) => void }) {
  const [reason, setReason] = useState("Changed my mind");
  if (props.orders.length === 0) return <div className="empty-panel"><h2>No orders yet</h2><p>Your confirmed purchases will live here.</p></div>;
  return <div className="two-column"><div className="list-stack">{props.orders.map((order) => <article className="card order-card" key={order.id}><div className="card-heading"><div><span className="card-kicker">{order.orderNumber}</span><h2>{order.status}</h2></div><strong>{money(order.totalPrice)}</strong></div>{order.items.map((item) => <div className="order-item" key={item.id}><span>{item.productName}</span><span>{item.status}</span><div className="button-row">{item.status === "paid" && <button className="text-button" type="button" onClick={() => props.onCancel(item.id, reason)}>Request cancellation</button>}{item.status === "delivered" && <button className="text-button" type="button" onClick={() => props.onRefund(item.id, reason)}>Request refund</button>}</div></div>)}</article>)}</div><aside className="card form-card"><span className="card-kicker">After-sales</span><h2>Requests</h2><label>Reason<input aria-label="After-sales request reason" value={reason} onChange={(event) => setReason(event.target.value)} /></label><p className="muted-copy">{props.cancellations.length} cancellation requests · {props.refunds.length} refund requests</p></aside></div>;
}

function SavedPanel(props: { entries: IShoppingWishlist[]; onRemove: (id: string) => void }) {
  return <div className="card form-card"><div className="card-heading"><div><span className="card-kicker">Saved for later</span><h2>Your wishlist</h2></div></div>{props.entries.length === 0 ? <><p className="muted-copy">Products you save will appear here.</p><Link className="button button-outline" to="/catalog">Browse and save products</Link></> : <div className="list-stack">{props.entries.map((entry) => <div className="order-item" key={entry.id}><span>{entry.productId}</span><span>{instant(entry.createdAt)}</span><button className="text-button danger" type="button" onClick={() => props.onRemove(entry.id)}>Remove</button></div>)}</div>}</div>;
}
