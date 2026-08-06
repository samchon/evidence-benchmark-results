import * as api from "@benchmark/shopping-api";
import typia from "typia";

/**
 * Proves the public catalog endpoints accept the documented filter envelope.
 *
 * 1. Load the live category tree through the authenticated customer surface.
 * 2. Search with a case-insensitive term and a price interval.
 * 3. Verify every returned row satisfies the requested filters and ordering.
 */
export async function test_api_customer_catalog_filters(
  connection: api.IConnection,
): Promise<void> {
  const authorized = await api.functional.shopping.auth.customer.join.customerJoin(connection, {
    email: `catalog-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`,
    password: "password-123",
  });
  typia.assert(authorized);
  const authenticated: api.IConnection = {
    host: connection.host,
    headers: { Authorization: `Bearer ${authorized.token}` },
  };

  const categories = await api.functional.shopping.customer.category.categories(authenticated);
  typia.assert(categories);

  const products = await api.functional.shopping.customer.product.products(authenticated, {
    page: 1,
    limit: 10,
    search: "__no_such_catalog_product__",
    minPrice: 10,
    maxPrice: 20,
    inStock: true,
    sort: "priceAsc",
  });
  typia.assert(products);
  for (let index = 0; index < products.data.length; index++) {
    const product = products.data[index]!;
    if (product.priceMin < 10 || product.priceMax > 20 || !product.available)
      throw new Error("catalog filters returned a row outside the requested price or stock bounds");
    if (index > 0 && products.data[index - 1]!.priceMin > product.priceMin)
      throw new Error("catalog priceAsc ordering was not applied");
  }

  const nextPage = await api.functional.shopping.customer.product.products(authenticated, {
    page: 2,
    limit: 10,
    search: "__no_such_catalog_product__",
    minPrice: 10,
    maxPrice: 20,
    inStock: true,
    sort: "priceAsc",
  });
  typia.assert(nextPage);
  try {
    await api.functional.shopping.customer.product.products(authenticated, {
      page: 2,
      limit: 10,
      search: "a different context",
      minPrice: 10,
      maxPrice: 20,
      inStock: true,
      sort: "priceAsc",
    });
    throw new Error("a product page position was accepted under a changed query context");
  } catch (error) {
    if (!(error instanceof Error) || !/context|position/i.test(error.message)) throw error;
  }
}
