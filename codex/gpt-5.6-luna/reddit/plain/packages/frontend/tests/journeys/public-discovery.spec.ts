import { expect, test, type Page } from "@playwright/test";

export async function journey_public_discovery(page: Page): Promise<void> {
  await page.goto("/popular");
  await page.getByRole("heading", { name: "Popular everywhere" }).waitFor();
  await page.getByRole("link", { name: "Communities", exact: true }).click();
  await page.getByRole("heading", { name: "Communities", exact: true }).waitFor();
  await page.locator("#search-community-names").fill(
    "no-match-for-this-journey",
  );
  await page.getByRole("heading", { name: "No communities found", exact: true }).waitFor();
  await page.locator("#search-community-names").fill("");
  await page.getByRole("heading", { name: "Communities", exact: true }).waitFor();
}

test("public discovery supports feed and name search", async ({ page }) => {
  await journey_public_discovery(page);
  await expect(page.getByRole("heading", { name: "Communities", exact: true })).toBeVisible();
});
