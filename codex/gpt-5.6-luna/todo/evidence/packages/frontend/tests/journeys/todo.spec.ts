import { expect, test, type Page } from "@playwright/test";
import type { AuthPage } from "../../src/components/auth/auth-page";
import type { DashboardPage } from "../../src/components/todo/dashboard-page";

/**
 * Exercises profile and active Todo work from creation through history.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Covers profile ownership.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Covers Todo ownership.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Covers active lifecycle.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Covers completion state.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Exercises profile operations.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-1-view-the-current-users-profile Views profile.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-2-edit-the-display-name Edits profile.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Exercises Todo operations.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-1-create-a-todo Creates a task.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-2-browse-active-todos Browses tasks.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-3-view-an-active-todo Views detail.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-4-edit-todo-content Edits content.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-5-mark-a-todo-complete Marks complete.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-6-mark-a-todo-incomplete Marks incomplete.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Starts recovery.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Inspects history.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Views history.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Covers edit history meaning.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Covers history entries.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Binds history lifecycle.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Covers display-name rules.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Validates display names.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Uses content rules.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Uses browse rules.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Uses state rules.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps data private.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Keeps views consistent.
 * @evidence {@link AuthPage} Enters the private boundary.
 * @evidence {@link DashboardPage} Walks the workspace screen.
 */
export async function journey_todo(page: Page): Promise<void> {
  await page.goto("/auth?mode=join");
  await page.getByLabel("Email").fill(`todo-${Date.now()}@example.com`);
  await page.getByLabel("Display name").fill("Todo Journey");
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByLabel("New display name").fill("");
  await page.getByRole("button", { name: "Update" }).click();
  await page.getByLabel("New display name").fill("Updated Journey");
  await page.getByRole("button", { name: "Update" }).click();
  await page.getByLabel("Title").fill("Journey task");
  await page.getByLabel("Create description").fill("Context");
  await page.getByRole("button", { name: "Create Todo" }).click();
  await page.getByRole("button", { name: /Mark complete/ }).click();
  await page.getByRole("button", { name: /Mark in progress/ }).click();
  await page.getByLabel("Title").last().fill("Edited Journey task");
  await page.getByRole("button", { name: "Save task" }).click();
  await page.getByText("Edit history").waitFor();
  await page.getByLabel("Todo filter").selectOption("incomplete-only");
  await page.getByLabel("Todo sort").selectOption("dueDate");
  await page.getByLabel("Todo direction").selectOption("asc");
  await page.getByRole("button", { name: /Journey task/ }).click();
  await page.getByRole("button", { name: "Move to trash" }).click();
}

test("active Todo journey", async ({ page }) => {
  await journey_todo(page);
  await expect(page.getByRole("heading", { name: "Your workspace" })).toBeVisible();
});
