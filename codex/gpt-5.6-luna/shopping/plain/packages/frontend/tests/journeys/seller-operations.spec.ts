import { expect, test } from "@playwright/test";

async function registerSeller(page: import("@playwright/test").Page): Promise<void> {
  await page.goto("/register/seller");
  await page.getByLabel("Email").fill(`seller.${Date.now()}@example.test`);
  await page.getByLabel("Password").fill("SellerPass123!");
  await page.getByRole("button", { name: "Create account" }).click();
}

test("seller registration preserves pending approval and allows profile changes live", async ({ page }) => {
  await registerSeller(page);
  await expect(page).toHaveURL(/\/app$/u);
  await expect(page.getByRole("heading", { name: "Operate the shop with context" })).toBeVisible();
  await page.getByRole("link", { name: "Shop profile" }).click();
  await expect(page.getByRole("heading", { name: "Shop profile" })).toBeVisible();
  await page.getByLabel("Shop name").fill("Ari's Market");
  await page.getByLabel("Shop description").fill("Small-batch goods with clear provenance.");
  await page.getByRole("button", { name: "Save shop profile" }).click();
  await page.reload();
  await expect(page.getByLabel("Shop name")).toHaveValue("Ari's Market");
  await expect(page.getByLabel("Shop description")).toHaveValue("Small-batch goods with clear provenance.");
  await page.getByLabel("Logo URL").fill("https://example.com/shop-logo.png");
  await page.getByRole("button", { name: "Save shop profile" }).click();
  await page.reload();
  await expect(page.getByLabel("Logo URL")).toHaveValue("https://example.com/shop-logo.png");
  await page.getByLabel("Shop description").fill("Small-batch goods with durable provenance.");
  await page.getByRole("button", { name: "Save shop profile" }).click();
  await page.reload();
  await expect(page.getByLabel("Logo URL")).toHaveValue("https://example.com/shop-logo.png");
  await page.getByLabel("Logo URL").fill("");
  await page.getByRole("button", { name: "Save shop profile" }).click();
  await page.reload();
  await expect(page.getByLabel("Logo URL")).toHaveValue("");
  await page.getByRole("link", { name: "Seller desk" }).click();
  await expect(page.getByText("pending", { exact: true }).first()).toBeVisible();
  await page.getByRole("link", { name: "Products", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Products and variants" })).toBeVisible();
  await page.getByRole("button", { name: "Create product" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByRole("link", { name: "Fulfillment", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Fulfillment and requests" })).toBeVisible();
  await page.getByRole("link", { name: "Applications", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Approval and applications" })).toBeVisible();
  await page.getByRole("link", { name: "Account", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Account security" })).toBeVisible();
});
