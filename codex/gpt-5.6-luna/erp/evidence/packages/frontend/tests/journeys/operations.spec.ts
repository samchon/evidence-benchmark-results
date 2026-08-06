import { expect, test, type Page } from "@playwright/test";

import type { OperationsPage } from "../../src/components/operations/operations-page";

/**
 * Walks the generated operation workbench as an ERP operator.
 *
 * @evidence {@link OperationsPage} Walks the operation workbench screen.
 */
export async function journey_operations_workbench(page: Page): Promise<void> {
  await page.goto("/");
  await page.getByLabel("Find an operation").fill("AuthUserLoginLogin");
  await page.getByRole("button", { name: "Auth User Login Login" }).click();
  await page.getByLabel("JSON arguments").fill('[{"email":"review@example.com","password":"wrong-password"}]');
  await page.getByRole("button", { name: "Run command" }).click();
}

test("operator can discover and run a generated command", async ({ page }) => {
  await journey_operations_workbench(page);
  await expect(page.getByRole("heading", { name: "ERP command center" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("AuthUserLoginLogin");
});
