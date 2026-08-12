import crypto from "node:crypto";
import type { IPage, IShoppingCategory, IShoppingCustomer, IShoppingProduct, IShoppingProductVariant } from "@benchmark/shopping-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Persists the curated taxonomy and seller merchandise aggregate. */
export namespace ShoppingCatalogProvider {
  interface InventoryRow { id: string; quantity_delta: number; reason: string; created_at: Date; }
  interface ImageRow { id: string; uri: string; sequence: number; created_at: Date; }
  interface VariantRow { id: string; product_id: string; sku_code: string; option_values: string; price_override: number | null; deleted_at: Date | null; created_at: Date; inventory_movements: InventoryRow[]; }
  interface ReviewRow { rating: number; }
  interface ProductRow { id: string; seller_id: string; category_id: string | null; name: string; description: string; base_price: number; created_at: Date; updated_at: Date; deleted_at: Date | null; images: ImageRow[]; variants: VariantRow[]; reviews: ReviewRow[]; seller: { shop_name: string | null }; }
  interface SnapshotRow { product_id: string; seller_id: string; name: string; description: string; category_id: string | null; base_price: number; aggregate: string; created_at: Date; }
  export async function categoryIndex(input: IPage.IRequest): Promise<IPage<IShoppingCategory>> {
    const rows = await MyGlobal.prisma.shopping_categories.findMany({ where: { deleted_at: null }, orderBy: [{ parent_id: "asc" }, { name: "asc" }] });
    const children = new Map<string | null, typeof rows>();
    for (const row of rows) children.set(row.parent_id, [...(children.get(row.parent_id) ?? []), row]);
    return page(input, (children.get(null) ?? []).map((row) => category(row, children)));
  }

  export async function categoryCreate(input: IShoppingCategory.ICreate): Promise<IShoppingCategory> {
    await assertParent(input.parentId ?? null);
    const now = new Date();
    return category(await MyGlobal.prisma.shopping_categories.create({ data: { id: crypto.randomUUID(), name: input.name, description: input.description, parent_id: input.parentId ?? null, created_at: now, updated_at: now } }));
  }

  export async function categoryAt(id: string): Promise<IShoppingCategory> {
    const row = await MyGlobal.prisma.shopping_categories.findFirst({ where: { id, deleted_at: null } });
    if (row === null) throw ErrorUtil.notFound("The category does not exist.");
    return category(row);
  }

  export async function categoryUpdate(id: string, input: IShoppingCategory.IUpdate): Promise<IShoppingCategory> {
    await categoryAt(id);
    await assertParent(input.parentId ?? null, id);
    return category(await MyGlobal.prisma.shopping_categories.update({ where: { id }, data: { name: input.name, description: input.description, parent_id: input.parentId ?? null, updated_at: new Date() } }));
  }

  export async function categoryErase(id: string): Promise<IShoppingCustomer.IResult> {
    await categoryAt(id);
    const childIds = (await MyGlobal.prisma.shopping_categories.findMany({ where: { parent_id: id }, select: { id: true } })).map((row) => row.id);
    const ids = [id, ...childIds];
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.shopping_categories.updateMany({ where: { id: { in: ids } }, data: { deleted_at: new Date(), updated_at: new Date() } }),
      MyGlobal.prisma.shopping_products.updateMany({ where: { category_id: { in: ids } }, data: { category_id: null, updated_at: new Date() } }),
    ]);
    return { success: true };
  }

  export async function productIndex(input: IShoppingProduct.IRequest): Promise<IPage<IShoppingProduct.ISummary>> {
    if (input.minimumPrice !== null && input.minimumPrice !== undefined && input.maximumPrice !== null && input.maximumPrice !== undefined && input.minimumPrice > input.maximumPrice) throw ErrorUtil.badRequest("The minimum price cannot exceed the maximum price.");
    const rows = await MyGlobal.prisma.shopping_products.findMany({ where: { deleted_at: null, ...(input.categoryId === null || input.categoryId === undefined ? {} : { category_id: input.categoryId }), ...(input.search === null || input.search === undefined || input.search.length === 0 ? {} : { OR: [{ name: { contains: input.search } }, { description: { contains: input.search } }] }) }, include: { seller: true, images: { orderBy: { sequence: "asc" } }, variants: { where: { deleted_at: null }, include: { inventory_movements: true } }, reviews: { where: { deleted_at: null } } } });
    const visible = rows.filter((row) => row.seller.deleted_at === null && row.seller.login_status === "active" && row.seller.approval_status === "approved" && row.seller.suspended_at === null).filter((row) => { const prices = row.variants.map((variant) => variant.price_override ?? row.base_price); const inRange = prices.length === 0 ? (input.minimumPrice === null || input.minimumPrice === undefined || row.base_price >= input.minimumPrice) && (input.maximumPrice === null || input.maximumPrice === undefined || row.base_price <= input.maximumPrice) : prices.some((price) => (input.minimumPrice === null || input.minimumPrice === undefined || price >= input.minimumPrice) && (input.maximumPrice === null || input.maximumPrice === undefined || price <= input.maximumPrice)); const stock = row.variants.some((variant) => variant.inventory_movements.reduce((sum, movement) => sum + movement.quantity_delta, 0) > 0); return inRange && (input.inStockOnly !== true || stock); });
    visible.sort((left, right) => compareCatalog(left, right, input.sort));
    return page(input, visible.map(summary));
  }

  export async function adminProductIndex(input: IShoppingProduct.IRequest): Promise<IPage<IShoppingProduct.ISummary>> {
    const rows = await MyGlobal.prisma.shopping_products.findMany({ where: { deleted_at: null }, include: { seller: true, images: { orderBy: { sequence: "asc" } }, variants: { where: { deleted_at: null }, include: { inventory_movements: true } }, reviews: { where: { deleted_at: null } } }, orderBy: { created_at: "desc" } });
    return page(input, rows.map(summary));
  }

  export async function adminProductDelete(id: string, reason: string, administratorId: string): Promise<IShoppingProduct> {
    if (reason.trim().length === 0) throw ErrorUtil.badRequest("A policy deletion reason is required.");
    const row = await productRow(id);
    if (row.deleted_at !== null) throw ErrorUtil.conflict("The product is already deleted.");
    const result = dto(row);
    const now = new Date();
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.shopping_product_snapshots.create({ data: { id: crypto.randomUUID(), product_id: row.id, seller_id: row.seller_id, name: row.name, description: row.description, category_id: row.category_id, base_price: row.base_price, aggregate: JSON.stringify({ images: row.images, variants: row.variants }), changed_fields: JSON.stringify({ kind: "administrator deletion", reason }), created_at: now } }),
      MyGlobal.prisma.shopping_inventory_movements.deleteMany({ where: { variant_id: { in: row.variants.map((variant) => variant.id) } } }),
      MyGlobal.prisma.shopping_product_variants.updateMany({ where: { id: { in: row.variants.map((variant) => variant.id) } }, data: { deleted_at: now, updated_at: now } }),
      MyGlobal.prisma.shopping_product_images.deleteMany({ where: { product_id: id } }),
      MyGlobal.prisma.shopping_products.update({ where: { id }, data: { deleted_at: now, updated_at: now } }),
      MyGlobal.prisma.shopping_wishlist_entries.deleteMany({ where: { product_id: id } }),
      MyGlobal.prisma.shopping_moderation_events.create({ data: { id: crypto.randomUUID(), administrator_id: administratorId, target_type: "product", target_id: id, action: "policy deletion", reason, before_state: "live", after_state: "deleted", created_at: now } }),
    ]);
    return result;
  }

  export async function productAt(id: string): Promise<IShoppingProduct> {
    const row = await productRow(id);
    return dto(row);
  }

  export async function productSnapshots(sellerId: string, productId: string, input: IPage.IRequest): Promise<IPage<IShoppingProduct>> {
    const product = await MyGlobal.prisma.shopping_products.findFirst({ where: { id: productId, seller_id: sellerId } });
    if (product === null && await MyGlobal.prisma.shopping_product_snapshots.findFirst({ where: { product_id: productId, seller_id: sellerId } }) === null) throw ErrorUtil.forbidden("The product snapshot is not owned by the seller.");
    const rows = await MyGlobal.prisma.shopping_product_snapshots.findMany({ where: { product_id: productId, seller_id: sellerId }, orderBy: [{ created_at: "desc" }, { id: "desc" }] });
    return page(input, rows.map((row) => snapshotDto(row)));
  }

  export async function productCreate(sellerId: string, input: IShoppingProduct.ICreate): Promise<IShoppingProduct> {
    await seller(sellerId);
    await liveCategory(input.categoryId ?? null);
    const now = new Date();
    const row = await MyGlobal.prisma.shopping_products.create({ data: { id: crypto.randomUUID(), seller_id: sellerId, category_id: input.categoryId ?? null, name: input.name, description: input.description, base_price: input.basePrice, created_at: now, updated_at: now } });
    await snapshot(row, "created");
    return productAt(row.id);
  }

  export async function productUpdate(sellerId: string, id: string, input: IShoppingProduct.IUpdate): Promise<IShoppingProduct> {
    await owned(sellerId, id);
    await liveCategory(input.categoryId ?? null);
    const row = await MyGlobal.prisma.shopping_products.update({ where: { id }, data: { category_id: input.categoryId ?? null, name: input.name, description: input.description, base_price: input.basePrice, updated_at: new Date() } });
    await snapshot(row, "updated");
    return productAt(row.id);
  }

  export async function productErase(sellerId: string, id: string): Promise<IShoppingCustomer.IResult> {
    const product = await owned(sellerId, id);
    const variants = await MyGlobal.prisma.shopping_product_variants.findMany({ where: { product_id: id, deleted_at: null }, select: { id: true } });
    if (await MyGlobal.prisma.shopping_order_items.findFirst({ where: { variant_id: { in: variants.map((variant) => variant.id) }, status: { in: ["paid", "shipped"] } } }) !== null || await MyGlobal.prisma.shopping_cancellation_requests.findFirst({ where: { status: "pending", order_item: { variant_id: { in: variants.map((variant) => variant.id) } } } }) !== null || await MyGlobal.prisma.shopping_refund_requests.findFirst({ where: { status: "pending", order_item: { variant_id: { in: variants.map((variant) => variant.id) } } } }) !== null) throw ErrorUtil.conflict("The product has unresolved commercial obligations.");
    const now = new Date();
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.shopping_product_snapshots.create({ data: { id: crypto.randomUUID(), product_id: product.id, seller_id: product.seller_id, name: product.name, description: product.description, category_id: product.category_id, base_price: product.base_price, aggregate: JSON.stringify({ images: product.images, variants: product.variants }), changed_fields: JSON.stringify({ kind: "deleted" }), created_at: now } }),
      MyGlobal.prisma.shopping_wishlist_entries.deleteMany({ where: { product_id: id } }),
      MyGlobal.prisma.shopping_inventory_movements.deleteMany({ where: { variant_id: { in: variants.map((variant) => variant.id) } } }),
      MyGlobal.prisma.shopping_product_variants.updateMany({ where: { id: { in: variants.map((variant) => variant.id) } }, data: { deleted_at: now, updated_at: now } }),
      MyGlobal.prisma.shopping_product_images.deleteMany({ where: { product_id: id } }),
      MyGlobal.prisma.shopping_products.update({ where: { id }, data: { deleted_at: now, updated_at: now } }),
    ]);
    return { success: true };
  }

  export async function imageCreate(sellerId: string, id: string, input: IShoppingProduct.IImageCreate): Promise<IShoppingProduct> {
    await owned(sellerId, id);
    const count = await MyGlobal.prisma.shopping_product_images.count({ where: { product_id: id } });
    await MyGlobal.prisma.shopping_product_images.create({ data: { id: crypto.randomUUID(), product_id: id, uri: input.uri, sequence: count, created_at: new Date() } });
    await snapshot(await MyGlobal.prisma.shopping_products.findUniqueOrThrow({ where: { id } }), "image created");
    return productAt(id);
  }

  export async function imageReorder(sellerId: string, id: string, input: IShoppingProduct.IImageReorder): Promise<IShoppingProduct> {
    await owned(sellerId, id);
    const rows = await MyGlobal.prisma.shopping_product_images.findMany({ where: { product_id: id } });
    if (rows.length !== input.imageIds.length || input.imageIds.some((imageId) => !rows.some((row) => row.id === imageId))) throw ErrorUtil.badRequest("The image order must contain every product image exactly once.");
    await MyGlobal.prisma.$transaction(input.imageIds.map((imageId, sequence) => MyGlobal.prisma.shopping_product_images.update({ where: { id: imageId }, data: { sequence: sequence + rows.length } })).concat(input.imageIds.map((imageId, sequence) => MyGlobal.prisma.shopping_product_images.update({ where: { id: imageId }, data: { sequence } }))));
    await snapshot(await MyGlobal.prisma.shopping_products.findUniqueOrThrow({ where: { id } }), "images reordered");
    return productAt(id);
  }

  export async function imageErase(sellerId: string, id: string, imageId: string): Promise<IShoppingProduct> {
    await owned(sellerId, id);
    await MyGlobal.prisma.shopping_product_images.deleteMany({ where: { id: imageId, product_id: id } });
    const rows = await MyGlobal.prisma.shopping_product_images.findMany({ where: { product_id: id }, orderBy: { sequence: "asc" } });
    await MyGlobal.prisma.$transaction(rows.map((row, sequence) => MyGlobal.prisma.shopping_product_images.update({ where: { id: row.id }, data: { sequence } })));
    await snapshot(await MyGlobal.prisma.shopping_products.findUniqueOrThrow({ where: { id } }), "image deleted");
    return productAt(id);
  }

  export async function variantCreate(sellerId: string, productId: string, input: IShoppingProduct.IVariantCreate): Promise<IShoppingProductVariant> {
    await owned(sellerId, productId);
    const normalized = await validateVariant(productId, input);
    const row = await MyGlobal.prisma.shopping_product_variants.create({ data: { id: crypto.randomUUID(), product_id: productId, sku_code: normalized.skuCode, option_values: JSON.stringify(normalized.optionValues), price_override: input.priceOverride ?? null, created_at: new Date(), updated_at: new Date() } });
    await snapshot(await MyGlobal.prisma.shopping_products.findUniqueOrThrow({ where: { id: productId } }), "variant created");
    return variant({ ...row, inventory_movements: [] });
  }

  export async function variantUpdate(sellerId: string, productId: string, variantId: string, input: IShoppingProduct.IVariantUpdate): Promise<IShoppingProductVariant> {
    await owned(sellerId, productId);
    const current = await MyGlobal.prisma.shopping_product_variants.findFirst({ where: { id: variantId, product_id: productId, deleted_at: null }, include: { inventory_movements: true } });
    if (current === null) throw ErrorUtil.notFound("The product variant does not exist.");
    const normalized = await validateVariant(productId, input, variantId);
    const row = await MyGlobal.prisma.shopping_product_variants.update({ where: { id: variantId }, data: { sku_code: normalized.skuCode, option_values: JSON.stringify(normalized.optionValues), price_override: input.priceOverride ?? null, updated_at: new Date() } });
    await snapshot(await MyGlobal.prisma.shopping_products.findUniqueOrThrow({ where: { id: productId } }), "variant updated");
    return variant({ ...row, inventory_movements: current.inventory_movements });
  }

  export async function variantErase(sellerId: string, productId: string, variantId: string): Promise<IShoppingCustomer.IResult> {
    await owned(sellerId, productId);
    const row = await MyGlobal.prisma.shopping_product_variants.findFirst({ where: { id: variantId, product_id: productId, deleted_at: null } });
    if (row === null) throw ErrorUtil.notFound("The product variant does not exist.");
    if (await MyGlobal.prisma.shopping_order_items.findFirst({ where: { variant_id: variantId, status: { in: ["paid", "shipped"] } } }) !== null || await MyGlobal.prisma.shopping_cancellation_requests.findFirst({ where: { status: "pending", order_item: { variant_id: variantId } } }) !== null || await MyGlobal.prisma.shopping_refund_requests.findFirst({ where: { status: "pending", order_item: { variant_id: variantId } } }) !== null) throw ErrorUtil.conflict("The product variant has unresolved commercial obligations.");
    await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_inventory_movements.deleteMany({ where: { variant_id: variantId } }), MyGlobal.prisma.shopping_product_variants.update({ where: { id: variantId }, data: { deleted_at: new Date(), updated_at: new Date() } })]);
    return { success: true };
  }

  export async function inventoryCreate(sellerId: string, variantId: string, input: IShoppingProductVariant.IMovement): Promise<IShoppingProductVariant.IMovementSummary> {
    const row = await MyGlobal.prisma.shopping_product_variants.findFirst({ where: { id: variantId, deleted_at: null }, include: { product: true, inventory_movements: true } });
    if (row === null) throw ErrorUtil.notFound("The product variant does not exist.");
    await owned(sellerId, row.product_id);
    if (input.quantity === 0) throw ErrorUtil.badRequest("Inventory movement quantity cannot be zero.");
    if (row.inventory_movements.reduce((sum, movement) => sum + movement.quantity_delta, 0) + input.quantity < 0) throw ErrorUtil.badRequest("Inventory cannot become negative.");
    const movement = await MyGlobal.prisma.shopping_inventory_movements.create({ data: { id: crypto.randomUUID(), variant_id: variantId, quantity_delta: input.quantity, reason: input.reason, created_at: new Date() } });
    return movementDto(movement);
  }

  export async function inventoryIndex(sellerId: string, variantId: string, input: IPage.IRequest): Promise<IPage<IShoppingProductVariant.IMovementSummary>> {
    const row = await MyGlobal.prisma.shopping_product_variants.findFirst({ where: { id: variantId }, select: { product_id: true } });
    if (row === null) throw ErrorUtil.notFound("The product variant does not exist.");
    await owned(sellerId, row.product_id);
    const movements = await MyGlobal.prisma.shopping_inventory_movements.findMany({ where: { variant_id: variantId }, orderBy: [{ created_at: "desc" }, { id: "desc" }] });
    return page(input, movements.map(movementDto));
  }

  async function productRow(id: string) {
    const row = await MyGlobal.prisma.shopping_products.findFirst({ where: { id }, include: { seller: true, images: { orderBy: { sequence: "asc" } }, variants: { where: { deleted_at: null }, include: { inventory_movements: true } }, reviews: { where: { deleted_at: null } } } });
    if (row === null || row.deleted_at !== null) throw ErrorUtil.notFound("The product does not exist.");
    return row;
  }
  async function seller(id: string) { const row = await MyGlobal.prisma.shopping_sellers.findFirst({ where: { id, deleted_at: null, login_status: "active", approval_status: "approved", suspended_at: null } }); if (row === null) throw ErrorUtil.forbidden("The seller account is not eligible for catalog activity."); return row; }
  async function owned(sellerId: string, productId: string) { const row = await productRow(productId); if (row.seller_id !== sellerId) throw ErrorUtil.forbidden("The product is owned by another seller."); await seller(sellerId); return row; }
  async function liveCategory(id: string | null) { if (id !== null && await MyGlobal.prisma.shopping_categories.findFirst({ where: { id, deleted_at: null } }) === null) throw ErrorUtil.badRequest("The category is not live."); }
  async function assertParent(id: string | null, self?: string) { if (id === null) return; const parent = await MyGlobal.prisma.shopping_categories.findFirst({ where: { id, deleted_at: null } }); if (parent === null || parent.parent_id !== null || parent.id === self) throw ErrorUtil.badRequest("Categories may only have one level of children."); }
  async function snapshot(row: { id: string; seller_id: string; name: string; description: string; category_id: string | null; base_price: number }, kind: string) { const current = await productRow(row.id); await MyGlobal.prisma.shopping_product_snapshots.create({ data: { id: crypto.randomUUID(), product_id: row.id, seller_id: row.seller_id, name: row.name, description: row.description, category_id: row.category_id, base_price: row.base_price, aggregate: JSON.stringify({ images: current.images, variants: current.variants }), changed_fields: JSON.stringify({ kind }), created_at: new Date() } }); }
  function category(row: { id: string; name: string; description: string; parent_id: string | null; created_at: Date }, children?: Map<string | null, Array<{ id: string; name: string; description: string; parent_id: string | null; created_at: Date }>>): IShoppingCategory { return { id: row.id, name: row.name, description: row.description, parentId: row.parent_id, children: (children?.get(row.id) ?? []).map((child) => category(child, children)), createdAt: row.created_at.toISOString() }; }
  function dto(row: ProductRow): IShoppingProduct { const reviews = row.reviews; return { id: row.id, sellerId: row.seller_id, categoryId: row.category_id, name: row.name, description: row.description, basePrice: row.base_price, images: row.images.map((image) => image.uri), variants: row.variants.map(variant), availability: availability(row.variants), rating: reviews.length === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length, reviewCount: reviews.length, createdAt: row.created_at.toISOString() }; }
  function snapshotDto(row: SnapshotRow): IShoppingProduct { const aggregate = JSON.parse(row.aggregate) as { images?: Array<{ uri?: string }> | string[]; variants?: Array<{ id: string; skuCode?: string; sku_code?: string; optionValues?: Record<string, string>; option_values?: string; priceOverride?: number | null; price_override?: number | null }> }; const variants = (aggregate.variants ?? []).map((value) => ({ id: value.id, productId: row.product_id, skuCode: value.skuCode ?? value.sku_code ?? "", optionValues: value.optionValues ?? (value.option_values === undefined ? {} : JSON.parse(value.option_values) as Record<string, string>), priceOverride: value.priceOverride ?? value.price_override ?? null, stock: 0, availability: "historical", createdAt: row.created_at.toISOString() })); return { id: row.product_id, sellerId: row.seller_id, categoryId: row.category_id, name: row.name, description: row.description, basePrice: row.base_price, images: (aggregate.images ?? []).map((image) => typeof image === "string" ? image : image.uri ?? ""), variants, availability: "historical", rating: 0, reviewCount: 0, createdAt: row.created_at.toISOString() }; }
  function summary(row: ProductRow): IShoppingProduct.ISummary { const product = dto(row); return { id: product.id, name: product.name, description: product.description, basePrice: product.basePrice, thumbnail: product.images[0] ?? null, sellerId: product.sellerId, sellerShopName: row.seller.shop_name ?? "", availability: product.availability, rating: product.rating, reviewCount: product.reviewCount }; }
  function variant(row: VariantRow): IShoppingProductVariant { const stock = row.inventory_movements.reduce((sum, movement) => sum + movement.quantity_delta, 0); return { id: row.id, productId: row.product_id, skuCode: row.sku_code, optionValues: JSON.parse(row.option_values) as Record<string, string>, priceOverride: row.price_override, stock, availability: row.deleted_at === null && stock > 0 ? "available" : row.deleted_at === null ? "outOfStock" : "retired", createdAt: row.created_at.toISOString() }; }
  function movementDto(row: InventoryRow): IShoppingProductVariant.IMovementSummary { return { id: row.id, quantity: row.quantity_delta, reason: row.reason, createdAt: row.created_at.toISOString() }; }
  function availability(variants: VariantRow[]): string { if (variants.length === 0) return "unavailable"; return variants.some((row) => row.inventory_movements.reduce((sum, movement) => sum + movement.quantity_delta, 0) > 0) ? "available" : "outOfStock"; }
  async function validateVariant(productId: string, input: IShoppingProduct.IVariantCreate, currentId?: string): Promise<{ skuCode: string; optionValues: Record<string, string> }> {
    const skuCode = input.skuCode.trim();
    if (skuCode.length === 0) throw ErrorUtil.badRequest("A variant SKU is required.");
    if (input.priceOverride !== null && input.priceOverride !== undefined && (!Number.isFinite(input.priceOverride) || input.priceOverride < 0)) throw ErrorUtil.badRequest("A variant price override must be a finite nonnegative number.");
    const all = await MyGlobal.prisma.shopping_product_variants.findMany({ select: { id: true, sku_code: true } });
    if (all.some((row) => row.id !== currentId && row.sku_code.trim().toLowerCase() === skuCode.toLowerCase())) throw ErrorUtil.conflict("The SKU code is already in use.");
    const entries = Object.entries(input.optionValues).map(([name, value]) => [name.trim(), value.trim()] as const);
    if (entries.length === 0 || entries.some(([name, value]) => name.length === 0 || value.length === 0)) throw ErrorUtil.badRequest("A variant requires nonempty option names and values.");
    const names = entries.map(([name]) => name.toLowerCase());
    if (new Set(names).size !== names.length) throw ErrorUtil.badRequest("Variant option names must be unique.");
    const optionValues = Object.fromEntries(entries) as Record<string, string>;
    const combination = entries.map(([name, value]) => `${name.toLowerCase()}=${value.toLowerCase()}`).sort((left, right) => left.localeCompare(right)).join("&");
    const variants = await MyGlobal.prisma.shopping_product_variants.findMany({ where: { product_id: productId, deleted_at: null }, select: { id: true, option_values: true } });
    if (variants.some((row) => row.id !== currentId && Object.entries(JSON.parse(row.option_values) as Record<string, string>).map(([name, value]) => `${name.trim().toLowerCase()}=${value.trim().toLowerCase()}`).sort((left, right) => left.localeCompare(right)).join("&") === combination)) throw ErrorUtil.conflict("The option combination is already in use.");
    return { skuCode, optionValues };
  }
  function compareCatalog(left: ProductRow, right: ProductRow, value: IShoppingProduct.IRequest["sort"]): number {
    if (value === "priceAsc" || value === "priceDesc") {
      const difference = displayedPrice(left) - displayedPrice(right);
      if (difference !== 0) return value === "priceAsc" ? difference : -difference;
    } else if (value === "name") {
      const difference = left.name.localeCompare(right.name);
      if (difference !== 0) return difference;
    } else {
      const difference = right.created_at.getTime() - left.created_at.getTime();
      if (difference !== 0) return difference;
    }
    return left.id.localeCompare(right.id);
  }
  function displayedPrice(row: ProductRow): number { return row.variants.length === 0 ? row.base_price : Math.min(...row.variants.map((variant) => variant.price_override ?? row.base_price)); }
  function page<T extends object>(input: IPage.IRequest, rows: T[]): IPage<T> { const current = input.page ?? 1; const limit = input.limit ?? 100; const records = rows.length; const pages = limit === 0 ? (records === 0 ? 0 : 1) : Math.ceil(records / limit); return { pagination: { current, limit, records, pages }, data: limit === 0 ? rows : rows.slice((current - 1) * limit, current * limit) }; }
}
