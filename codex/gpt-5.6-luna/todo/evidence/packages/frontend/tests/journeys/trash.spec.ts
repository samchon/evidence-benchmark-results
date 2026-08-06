import { expect, test, type Page } from "@playwright/test";
import type { AuthPage } from "../../src/components/auth/auth-page";
import type { DashboardPage } from "../../src/components/todo/dashboard-page";
import type { TrashPage } from "../../src/components/trash/trash-page";

/**
 * Walks a task into trash and verifies the recovery surface.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Covers availability.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-3-move-an-active-todo-to-trash Moves a task to trash.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-4-restore-a-trashed-todo Restores a task.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-5-permanently-delete-a-trashed-todo Covers terminal deletion.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Covers recovery.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-1-browse-trashed-todos Browses trash.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-2-view-a-trashed-todo Views retained detail.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-3-restore-a-todo-from-trash Restores retained work.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-4-permanently-delete-a-todo-from-trash Erases retained work.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Preserves recovery integrity.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Completes terminal deletion.
 * @evidence {@link AuthPage} Enters the private boundary.
 * @evidence {@link DashboardPage} Starts the task lifecycle.
 * @evidence {@link TrashPage} Walks the recovery screen.
 */
export async function journey_trash(page: Page): Promise<void> {
  await page.goto("/auth?mode=join");
  await page.getByLabel("Email").fill(`trash-${Date.now()}@example.com`);
  await page.getByLabel("Display name").fill("Trash Journey");
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByLabel("Title").fill("Recoverable task");
  await page.getByRole("button", { name: "Create Todo" }).click();
  await page.getByRole("button", { name: "Move to trash" }).click();
  await page.getByRole("link", { name: "Open trash" }).click();
  await page.getByRole("button", { name: /Recoverable task/ }).waitFor();
  await page.getByRole("button", { name: /Recoverable task/ }).click();
  await page.getByText("Preserved edit history").waitFor();
  await page.getByRole("button", { name: "Restore task" }).click();
  await page.getByRole("link", { name: "Workspace" }).waitFor();
  await page.getByRole("link", { name: "Workspace" }).click();
  await page.getByRole("button", { name: /Recoverable task/ }).click();
  await page.getByRole("button", { name: "Move to trash" }).click();
  await page.getByRole("link", { name: "Open trash" }).click();
  await page.getByRole("button", { name: /Recoverable task/ }).click();
  await page.getByRole("button", { name: "Permanently erase" }).click();
  await page.getByText("Trash is empty").waitFor();
}

test("trash recovery journey", async ({ page }) => {
  await journey_trash(page);
  await expect(page.getByRole("heading", { name: "Trash", exact: true })).toBeVisible();
});
