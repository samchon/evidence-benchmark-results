/* Native controls are rendered by the design-system Button wrapper. */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import * as api from "@benchmark/shopping-api";
import { useState } from "react";

import { Button, Card, EmptyState, ErrorState, Field, LoadingState, PageHeader, SelectField, StatusPill } from "@/components/ui";
import { useCategories, useInventory, useProductSnapshots, useShoppingOperations } from "@/lib/shopping/hooks";
import { formatDate, toErrorMessage } from "@/lib/utils";

const initialProduct: api.IShoppingProduct.ICreate = { name: "", description: "", categoryId: "", basePrice: 0 };

export function ProductWorkbenchPage() {
  const operations = useShoppingOperations();
  const categories = useCategories();
  const [product, setProduct] = useState<api.IShoppingProduct | null>(null);
  const [productForm, setProductForm] = useState(initialProduct);
  const [variant, setVariant] = useState<api.IShoppingVariant | null>(null);
  const [variantForm, setVariantForm] = useState({ sku: "", optionName: "Color", optionValue: "", priceOverride: "" });
  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [urls, setUrls] = useState("");
  const [imageOrder, setImageOrder] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [snapshotPage, setSnapshotPage] = useState(1);
  const [inventoryPage, setInventoryPage] = useState(1);
  const [reason, setReason] = useState("Inventory correction");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const snapshots = useProductSnapshots(productId, { page: snapshotPage, limit: 20 }, productId !== "");
  const inventory = useInventory(variantId, { page: inventoryPage, limit: 20 }, variantId !== "");
  const run = async (action: () => Promise<unknown>, success: string) => {
    if (busy) return;
    setBusy(true);
    setError(null); setMessage(null);
    try { await action(); setMessage(success); } catch (caught) { setError(toErrorMessage(caught)); } finally { setBusy(false); }
  };
  const queryError = categories.error ?? snapshots.error ?? inventory.error;
  if (categories.isPending) return <section className="page"><LoadingState label="Loading seller catalog controls" /></section>;
  if (queryError !== null && queryError !== undefined) return <section className="page"><ErrorState error={queryError} onRetry={() => void Promise.all([categories.refetch(), snapshots.refetch(), inventory.refetch()])} /></section>;
  const saveProduct = async () => {
    if (product === null && productId.trim() !== "") setProduct(await operations.seller.productUpdate(productId.trim(), productForm));
    else if (product === null) { const created = await operations.seller.productCreate(productForm); setProduct(created); setProductId(created.id); }
    else setProduct(await operations.seller.productUpdate(product.id, productForm));
  };
  const saveVariant = async () => {
    const body: api.IShoppingVariant.ICreate = { sku: variantForm.sku, options: { [variantForm.optionName]: variantForm.optionValue }, ...(variantForm.priceOverride === "" ? {} : { priceOverride: Number(variantForm.priceOverride) }) };
    if (variant === null) { const created = await operations.seller.variantCreate(productId, body); setVariant(created); setVariantId(created.id); }
    else setVariant(await operations.seller.variantUpdate(variant.id, body));
  };
  const updateExistingVariant = async () => {
    const body: api.IShoppingVariant.IUpdate = { sku: variantForm.sku, options: { [variantForm.optionName]: variantForm.optionValue }, ...(variantForm.priceOverride === "" ? {} : { priceOverride: Number(variantForm.priceOverride) }) };
    setVariant(await operations.seller.variantUpdate(variantId.trim(), body));
  };
  return <section className="page">
    <PageHeader eyebrow="Seller / catalog" title="Products and variants" detail="Manage the product aggregate, immutable snapshots, ordered media, variants, and append-only inventory evidence." />
    <div className="split-layout">
      <Card className="form-card"><h2>{product === null && productId.trim() === "" ? "Create product" : "Edit product"}</h2><Field label="Product ID (optional for create)" value={productId} onChange={(event) => setProductId(event.target.value)} hint="Leave blank to create. Enter an owned product ID to update it." /><Field label="Name" value={productForm.name} onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))} required /><Field label="Description" value={productForm.description} onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))} required /><SelectField label="Category" value={productForm.categoryId} onChange={(value) => setProductForm((current) => ({ ...current, categoryId: value }))} options={[{ label: "Choose a category", value: "" }, ...(categories.data ?? []).flatMap((item) => [{ label: item.name, value: item.id }, ...item.children.map((child) => ({ label: child.name, value: child.id }))])]} /><Field label="Base price" type="number" min={0} value={productForm.basePrice} onChange={(event) => setProductForm((current) => ({ ...current, basePrice: Number(event.target.value) }))} required /><Button onClick={() => void run(saveProduct, product === null && productId.trim() === "" ? "Product created." : "Product updated.")}>{product === null && productId.trim() === "" ? "Create product" : "Save product"}</Button></Card>
      <Card className="form-card"><h2>{variant === null ? "Add variant" : "Edit variant"}</h2><Field label="Variant SKU" value={variantForm.sku} onChange={(event) => setVariantForm((current) => ({ ...current, sku: event.target.value }))} required /><div className="two-col"><Field label="Option name" value={variantForm.optionName} onChange={(event) => setVariantForm((current) => ({ ...current, optionName: event.target.value }))} /><Field label="Option value" value={variantForm.optionValue} onChange={(event) => setVariantForm((current) => ({ ...current, optionValue: event.target.value }))} /></div><Field label="Price override" type="number" min={0} value={variantForm.priceOverride} onChange={(event) => setVariantForm((current) => ({ ...current, priceOverride: event.target.value }))} /><Button disabled={productId === ""} onClick={() => void run(saveVariant, variant === null ? "Variant created." : "Variant updated.")}>{variant === null ? "Add variant" : "Save variant"}</Button></Card>
    </div>
    <Card className="form-card"><h2>Existing variant controls</h2><Field label="Variant ID" value={variantId} onChange={(event) => setVariantId(event.target.value)} hint="Use this to edit or delete a variant not created in this session." required /><div className="button-row"><Button disabled={variantId.trim() === ""} onClick={() => void run(updateExistingVariant, "Variant updated.")}>Update variant</Button><Button tone="danger" disabled={variantId.trim() === ""} onClick={() => void run(async () => { await operations.seller.variantDelete(variantId.trim()); setVariant(null); setVariantId(""); }, "Variant deleted.")}>Delete variant</Button></div></Card>
    {product === null ? <EmptyState title="No product selected" detail="Create a product to unlock media, snapshots, and inventory controls." /> : <ProductControls product={product} variant={variant} variantId={variantId} setProduct={setProduct} setVariant={setVariant} setVariantId={setVariantId} operations={operations} urls={urls} setUrls={setUrls} imageOrder={imageOrder} setImageOrder={setImageOrder} quantity={quantity} setQuantity={setQuantity} reason={reason} setReason={setReason} inventory={inventory} inventoryPage={inventoryPage} setInventoryPage={setInventoryPage} snapshots={snapshots} snapshotPage={snapshotPage} setSnapshotPage={setSnapshotPage} run={run} />}
    {product === null ? null : <Card className="form-card"><h2>Product lifecycle</h2><p className="muted">Deleting removes the live catalog aggregate only when commercial obligations allow it; retained order and snapshot evidence stays available.</p><Button tone="danger" onClick={() => void run(async () => { await operations.seller.productDelete(product.id); setProduct(null); setProductId(""); setVariant(null); setVariantId(""); }, "Product deleted.")}>Delete product</Button></Card>}
    {error === null ? null : <p className="form-message error" role="alert">{error}</p>}{message === null ? null : <p className="form-message success" role="status">{message}</p>}
  </section>;
}

function ProductControls(props: { product: api.IShoppingProduct; variant: api.IShoppingVariant | null; variantId: string; setProduct: (product: api.IShoppingProduct) => void; setVariant: (variant: api.IShoppingVariant | null) => void; setVariantId: (id: string) => void; operations: ReturnType<typeof useShoppingOperations>; urls: string; setUrls: (value: string) => void; imageOrder: string; setImageOrder: (value: string) => void; quantity: number; setQuantity: (value: number) => void; reason: string; setReason: (value: string) => void; inventory: ReturnType<typeof useInventory>; inventoryPage: number; setInventoryPage: (page: number) => void; snapshots: ReturnType<typeof useProductSnapshots>; snapshotPage: number; setSnapshotPage: (page: number) => void; run: (action: () => Promise<unknown>, success: string) => Promise<void> }) {
  const { product, variant, variantId, setProduct, setVariant, setVariantId, operations, run } = props;
  return <><Card className="form-card"><div className="split"><div><h2>{product.name}</h2><p className="muted">{product.id}</p></div><StatusPill value={product.available ? "Available" : "Unavailable"} /></div><h3>Product images</h3><Field label="Image URLs" value={props.urls} onChange={(event) => props.setUrls(event.target.value)} hint="Separate URLs with commas." /><Field label="Image order IDs" value={props.imageOrder} onChange={(event) => props.setImageOrder(event.target.value)} hint="Separate IDs with commas." /><div className="button-row"><Button onClick={() => void run(async () => setProduct(await operations.seller.imageUpload(product.id, { urls: props.urls.split(",").map((value) => value.trim()).filter(Boolean) })), "Images uploaded.")}>Upload images</Button><Button tone="quiet" onClick={() => void run(async () => setProduct(await operations.seller.imageReorder(product.id, { imageIds: props.imageOrder.split(",").map((value) => value.trim()).filter(Boolean) })), "Image order saved.")}>Save image order</Button></div>{product.images.map((image) => <div className="request-row" key={image.id}><span>{image.order}: {image.url}</span><Button tone="danger" onClick={() => void run(async () => setProduct(await operations.seller.imageDelete(product.id, image.id)), "Image deleted.")}>Delete</Button></div>)}</Card><div className="split-layout"><Card className="form-card"><h2>Inventory movement</h2>{variant === null ? <p className="muted">No variant selected. Add a variant above to see and change its current stock.</p> : <p className="muted">Current stock: {variant.stock} ({variant.available ? "available" : "unavailable"})</p>}<Field label="Quantity" type="number" min={1} value={props.quantity} onChange={(event) => props.setQuantity(Number(event.target.value))} /><Field label="Reason" value={props.reason} onChange={(event) => props.setReason(event.target.value)} /><div className="button-row"><Button disabled={variantId === ""} onClick={() => void run(async () => setVariant(await operations.seller.restock(variantId, { quantity: props.quantity, reason: props.reason })), "Inventory restocked.")}>Restock</Button><Button tone="quiet" disabled={variantId === ""} onClick={() => void run(async () => setVariant(await operations.seller.subtract(variantId, { quantity: props.quantity, reason: props.reason })), "Inventory subtracted.")}>Subtract</Button></div>{props.inventory.isPending ? <LoadingState label="Loading inventory history" /> : props.inventory.data?.data.length === 0 ? <p className="muted">No inventory movements recorded.</p> : props.inventory.data?.data.map((entry) => <p className="muted" key={entry.id}>{entry.quantityChange} - {entry.reason} - {formatDate(entry.createdAt)}</p>)}<Pagination current={props.inventory.data?.pagination.current ?? props.inventoryPage} pages={props.inventory.data?.pagination.pages ?? 1} onChange={props.setInventoryPage} /></Card><Card><h2>Immutable product snapshots</h2>{props.snapshots.isPending ? <LoadingState label="Loading product history" /> : props.snapshots.data?.data.length === 0 ? <p className="muted">No snapshots recorded yet.</p> : props.snapshots.data?.data.map((snapshot) => <div className="request-row" key={snapshot.id}><span>{formatDate(snapshot.createdAt)} - {snapshot.changed.join(", ")}</span><StatusPill value="Retained" /></div>)}<Pagination current={props.snapshots.data?.pagination.current ?? props.snapshotPage} pages={props.snapshots.data?.pagination.pages ?? 1} onChange={props.setSnapshotPage} /></Card></div></>;
}

function Pagination(props: { current: number; pages: number; onChange: (page: number) => void }) { return <div className="pagination"><Button tone="quiet" disabled={props.current <= 1} onClick={() => props.onChange(props.current - 1)}>Previous</Button><span>Page {props.current} of {Math.max(props.pages, 1)}</span><Button tone="quiet" disabled={props.current >= props.pages} onClick={() => props.onChange(props.current + 1)}>Next</Button></div>; }

export default ProductWorkbenchPage;
