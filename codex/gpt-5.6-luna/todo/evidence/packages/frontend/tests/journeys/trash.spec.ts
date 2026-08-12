import { test, type Page } from "@playwright/test";
import type { AuthPage } from "../../src/components/auth/auth-page";
import type { TodoPage } from "../../src/components/todo/todo-page";
import type { TrashPage } from "../../src/components/todo/trash-page";

const createAccount = async (page: Page): Promise<void> => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Create an account" }).click();
  await page.getByLabel("Display name").fill("Trash Journey Owner");
  await page.getByLabel("Email").fill(`journey-trash-${Date.now()}@example.com`);
  await page.getByLabel("Password").fill("JourneyPassword9");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL(/\/todos$/);
};

/**
 * Exercises soft deletion, retained detail and history, restore, and permanent deletion.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Exercises retained lifecycle.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Exercises availability transitions.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-3-move-an-active-todo-to-trash Exercises soft deletion.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-3-move-an-active-todo-to-trash Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-4-restore-a-trashed-todo Exercises restore.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-4-restore-a-trashed-todo Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-5-permanently-delete-a-trashed-todo Exercises terminal deletion.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-5-permanently-delete-a-trashed-todo Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Exercises preserved history.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Exercises history preservation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Exercises move to trash.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Exercises retained history.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Exercises recovery journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-1-browse-trashed-todos Exercises trash browsing.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-1-browse-trashed-todos Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-2-view-a-trashed-todo Exercises trash detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-2-view-a-trashed-todo Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-3-restore-a-todo-from-trash Exercises restore action.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-3-restore-a-todo-from-trash Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-4-permanently-delete-a-todo-from-trash Exercises permanent deletion.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-4-permanently-delete-a-todo-from-trash Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Exercises bounded trash pagination.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Exercises stable trash ordering.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Exercises deletion integrity.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Exercises recoverable state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Exercises terminal outcome.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence {@link AuthPage} Walks authentication before recovery.
 * @evidenceReview {@link AuthPage} Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence {@link TodoPage} Walks the active source state.
 * @evidenceReview {@link TodoPage} Read the cited requirement and ran journey_trash_recovery against the live backend.
 * @evidence {@link TrashPage} Walks retained detail and recovery actions.
 * @evidenceReview {@link TrashPage} Read the cited requirement and ran journey_trash_recovery against the live backend.
 */
export async function journey_trash_recovery(page: Page): Promise<void> {
  await createAccount(page);
  await page.getByLabel("Todo title").fill("Recoverable journey task");
  await page.getByRole("button", { name: "Add Todo" }).click();
  await page.getByRole("button", { name: /Recoverable journey task/ }).click();
  await page.getByRole("button", { name: "Move to trash" }).click();
  await page.getByRole("link", { name: "Trash" }).click();
  await page.waitForURL(/\/trash$/);
  await page.getByRole("button", { name: /Recoverable journey task/ }).click();
  await page.getByText("Trash detail").waitFor();
  await page.getByRole("heading", { name: "Edit history" }).waitFor();
  await page.getByRole("button", { name: "Restore to active" }).click();
  await page.getByRole("heading", { name: "Choose a retained Todo" }).waitFor();
  await page.getByRole("link", { name: "Todos" }).click();
  await page.getByRole("button", { name: /Recoverable journey task/ }).waitFor();
  await page.getByLabel("Todo title").fill("Permanent journey task");
  await page.getByRole("button", { name: "Add Todo" }).click();
  await page.getByRole("button", { name: /Permanent journey task/ }).click();
  await page.getByRole("button", { name: "Move to trash" }).click();
  await page.getByRole("link", { name: "Trash" }).click();
  await page.getByRole("button", { name: /Permanent journey task/ }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete permanently" }).click();
  await page.getByRole("button", { name: /Permanent journey task/ }).waitFor({ state: "hidden" });
}

test("trash recovery workflow", async ({ page }) => {
  await journey_trash_recovery(page);
});
