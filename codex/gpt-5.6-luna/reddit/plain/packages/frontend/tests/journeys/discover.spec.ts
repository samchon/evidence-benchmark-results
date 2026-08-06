import { expect, test } from "@playwright/test";

/** Public discovery journey for REQ-FUNC-COMMUNITY-002/003 and REQ-FUNC-FEED-002. */
test("public discovery and guide are navigable", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Find your people" })).toBeVisible();
  await expect(page.getByLabel("Search communities")).toBeVisible();
  await page.getByLabel("Search communities").fill("books");
  await expect(page.getByLabel("Search communities")).toHaveValue("books");
  await page.getByLabel("Popular sort").selectOption("top");
  await expect(page.getByLabel("Popular sort")).toHaveValue("top");
  await expect(page.getByRole("heading", { name: /Popular right now|No communities found|Find your people/ }).first()).toBeVisible();
  await page.getByRole("link", { name: "Guide" }).click();
  await expect(page.getByRole("heading", { name: "A slower, kinder front page" })).toBeVisible();
});
