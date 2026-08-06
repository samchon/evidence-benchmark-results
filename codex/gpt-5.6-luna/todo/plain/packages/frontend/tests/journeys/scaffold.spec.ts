import { expect, test, type Page } from "@playwright/test";

/** Navigates to the private entry screen. */
export async function journey_scaffold_loads(page: Page): Promise<void> {
  const response = await page.goto("/");
  if (response === null) throw new Error("Navigation returned no response.");
  if (response.ok() === false)
    throw new Error(`Navigation failed with status ${response.status()}.`);
  if (await page.getByRole("heading", { name: "Tasks" }).count() !== 0)
    throw new Error("Anonymous entry exposed the private workspace.");
}

test("the sign-in journey loads", async ({ page }) => {
  await journey_scaffold_loads(page);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Todo desk");
  await expect(page.getByRole("button", { name: "Sign in" }).first()).toBeVisible();
});
