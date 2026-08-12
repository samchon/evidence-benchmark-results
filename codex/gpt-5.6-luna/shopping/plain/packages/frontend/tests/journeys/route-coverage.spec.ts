import { expect, test } from "@playwright/test";

test("authenticated customer journeys walk every customer route and its empty outcomes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Shop with less guesswork." })).toBeVisible();

  for (const [route, selector] of [["/login", ".auth-panel"], ["/recover", ".auth-panel"], ["/dev/gallery", "body"]] as const) {
    await page.goto(route);
    await expect(page).toHaveURL(new RegExp(`${route.replaceAll("/", "\\/")}$`));
    await expect(page.locator(selector)).toBeVisible();
  }

  await page.goto("/register/customer");
  await page.getByLabel("Email").fill(`route-coverage.${Date.now()}@example.test`);
  await page.getByLabel("Password").fill("CustomerPass123!");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/app$/);

  const routes: Array<[string, RegExp]> = [
    ["/app", /Your commerce desk|Good to see you/],
    ["/app/catalog", /Browse the live catalog/],
    ["/app/product/missing", /Product not found|We could not load this view/],
    ["/app/seller/missing", /Seller not found|We could not load this view/],
    ["/app/cart", /Your cart/],
    ["/app/orders", /Orders/],
    ["/app/orders/missing", /Order not found|We could not load this view/],
    ["/app/profile", /Personal profile/],
    ["/app/account", /Account security/],
    ["/app/addresses", /Saved addresses/],
    ["/app/wishlist", /Wishlist/],
    ["/app/applications", /Administrator applications/],
    ["/app/reviews", /Verified feedback/],
  ];

  for (const [route, title] of routes) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: title }).first()).toBeVisible();
  }
});
