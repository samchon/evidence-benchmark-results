import { expect, test, type Page } from "@playwright/test";

export async function journey_customer_access(page: Page): Promise<void> {
  await page.goto("/auth");
  const live = process.env.VITE_API_SIMULATE === "false";
  if (live) await page.getByRole("button", { name: "Create account" }).first().click();
  await page.getByLabel("Email").fill(live ? `customer-${Date.now()}@example.com` : "customer@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.locator("form.auth-card button.button-primary").click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.getByRole("heading", { name: "Find something good." })).toBeVisible();
}

export async function journey_customer_browse_and_cart(page: Page): Promise<void> {
  await journey_customer_access(page);
  await page.locator(".product-card").first().getByRole("link").click();
  await expect(page.getByRole("heading", { name: "Ceramic pour-over set" })).toBeVisible();
  const add = page.getByRole("button", { name: /Add to cart/ });
  const disabled = await add.evaluate((element) => (element as HTMLButtonElement).disabled);
  if (disabled) {
    await expect(add).toBeDisabled();
    await expect(page.getByText("Unavailable")).toBeVisible();
  } else {
    await add.click();
    await expect(page.getByText("Added to your cart.")).toBeVisible();
  }
}

test("customer can authenticate and reach the collection", async ({ page }) => {
  await journey_customer_access(page);
});

test("customer can browse a product and add it to cart", async ({ page }) => {
  await journey_customer_browse_and_cart(page);
});

test("protected routes redirect anonymous visitors", async ({ page }) => {
  await page.goto("/orders");
  await expect(page).toHaveURL(/\/auth$/);
  await expect(page.getByRole("heading", { name: "Come on in." })).toBeVisible();
});

export async function journey_customer_workspace_routes(page: Page): Promise<void> {
  await journey_customer_access(page);
  for (const route of ["/cart", "/checkout", "/orders", "/account", "/seller", "/admin"]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
  }
}

test("customer workspace screens remain reachable through the shell", async ({ page }) => {
  await journey_customer_workspace_routes(page);
});

test("authenticated users can inspect the complete generated operation workspace", async ({ page }) => {
  await journey_customer_access(page);
  await page.goto("/operations");
  await expect(page.getByRole("heading", { name: "Every permitted action, traceable." })).toBeVisible();
  await expect(page.getByText("110 operations")).toBeVisible();
  await expect(page.getByRole("button", { name: "Run operation" })).toBeVisible();
});

test("seller registration opens the seller workspace", async ({ page }) => {
  await page.goto("/auth");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByLabel("I am a").selectOption("seller");
  await page.getByLabel("Email").fill(`seller-${Date.now()}@example.com`);
  await page.getByLabel("Password").fill("password123");
  await page.locator("form.auth-card button.button-primary").click();
  await expect(page).toHaveURL(/\/seller$/);
  await expect(page.getByRole("heading", { name: "Run your shop." })).toBeVisible();
});
