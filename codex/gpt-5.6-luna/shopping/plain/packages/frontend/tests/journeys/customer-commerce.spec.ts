import { expect, test } from "@playwright/test";

async function registerCustomer(page: import("@playwright/test").Page): Promise<void> {
  await page.goto("/register/customer");
  await page.getByLabel("Email").fill(`commerce.${Date.now()}@example.test`);
  await page.getByLabel("Password").fill("CustomerPass123!");
  await page.getByRole("button", { name: "Create account" }).click();
}

test("customer discovery shows an isolated empty cart outcome live", async ({ page }) => {
  await registerCustomer(page);
  await expect(page).toHaveURL(/\/app$/u);
  await page.getByRole("link", { name: "Catalog", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Browse the live catalog" })).toBeVisible();
  await page.getByRole("link", { name: "Cart" }).click();
  await expect(page.getByRole("heading", { name: "Your cart", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
  await expect(page.getByText("Choose a specific in-stock variant from the catalog.")).toBeVisible();
});

test("customer address and administrator application changes persist live", async ({ page }) => {
  await registerCustomer(page);
  await page.getByRole("link", { name: "Addresses" }).click();
  await expect(page.getByRole("heading", { name: "Saved addresses" })).toBeVisible();
  await page.getByLabel(/recipient name/i).fill("Ari Shopper");
  await page.getByLabel(/recipient phone/i).fill("555-0101");
  await page.getByLabel(/street address/i).fill("1 Market Street");
  await page.getByLabel(/^city$/i).fill("Seoul");
  await page.getByLabel(/state or province/i).fill("Seoul");
  await page.getByLabel(/postal code/i).fill("04524");
  await page.getByLabel(/^country$/i).fill("South Korea");
  await page.getByRole("button", { name: "Save address" }).click();
  await expect(page.getByRole("heading", { name: "Ari Shopper" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Ari Shopper" })).toBeVisible();
  await page.getByRole("link", { name: "Applications", exact: true }).click();
  await page.getByLabel("Reason").fill("I can help review marketplace governance.");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByRole("heading", { name: "pending", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "pending", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Orders", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Orders", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Account", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Account security" })).toBeVisible();
  await page.getByRole("link", { name: "Reviews", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Verified feedback" })).toBeVisible();
});
