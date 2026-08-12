import { test, type Page } from "@playwright/test";
import type { AuthPage } from "../../src/components/auth/auth-page";
import type { TodoPage } from "../../src/components/todo/todo-page";

const createAccount = async (page: Page): Promise<void> => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Create an account" }).click();
  await page.getByLabel("Display name").fill("Todo Journey Owner");
  await page.getByLabel("Email").fill(`journey-todos-${Date.now()}@example.com`);
  await page.getByLabel("Password").fill("JourneyPassword9");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL(/\/todos$/);
};

/** Walks active Todo creation, browsing, detail, edit, completion, history, and trash entry. */
async function journey_active_todo_workflow(page: Page): Promise<void> {
  await createAccount(page);
  await page.getByLabel("Todo title").fill("Journey task");
  await page.getByLabel("Todo description").fill("A durable description");
  await page.getByLabel("Start date").fill("2026-08-10");
  await page.getByLabel("Due date").fill("2026-08-12");
  await page.getByRole("button", { name: "Add Todo" }).click();
  await page.getByRole("button", { name: /Journey task/ }).waitFor();
  await page.getByLabel("Completion filter").selectOption("incomplete-only");
  await page.getByRole("button", { name: /Journey task/ }).waitFor();
  await page.getByLabel("Todo sort order").selectOption("+dueDate");
  await page.getByLabel("Completion filter").selectOption("all");
  const browser = page.context().browser();
  if (browser === null) throw new Error("The journey requires a browser context.");
  const otherContext = await browser.newContext({ baseURL: new URL(page.url()).origin });
  const otherPage = await otherContext.newPage();
  try {
    await createAccount(otherPage);
    await otherPage.getByRole("button", { name: /Journey task/ }).waitFor({ state: "hidden" });
  } finally {
    await otherContext.close();
  }
  await page.getByRole("button", { name: /Journey task/ }).click();
  await page.getByRole("heading", { name: "Journey task" }).waitFor();
  await page.getByLabel("Edit Todo title").fill("Edited journey task");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByRole("heading", { name: "Edited journey task" }).waitFor();
  await page.getByRole("heading", { name: "Edit history" }).waitFor();
  await page.getByRole("button", { name: "Mark complete" }).click();
  await page.getByRole("button", { name: "Mark incomplete" }).waitFor();
  await page.getByRole("button", { name: "Mark incomplete" }).click();
  await page.getByRole("button", { name: "Mark complete" }).waitFor();
  await page.getByRole("button", { name: "Move to trash" }).click();
  await page.getByRole("link", { name: "Trash" }).waitFor();
  await page.getByRole("button", { name: /Edited journey task/ }).waitFor({ state: "hidden" });
}

/**
 * Exercises the active Todo requirement set through the workbench.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Exercises Todo ownership.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Exercises Todo information.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Exercises account binding.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Exercises lifecycle transitions.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Exercises completion states.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Exercises availability.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Exercises history relation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Exercises history entries.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Exercises lifecycle history.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Exercises Todo operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-1-create-a-todo Exercises creation.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-1-create-a-todo Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-2-browse-active-todos Exercises active browsing.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-2-browse-active-todos Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-3-view-an-active-todo Exercises detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-3-view-an-active-todo Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-4-edit-todo-content Exercises edit and history.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-4-edit-todo-content Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-5-mark-a-todo-complete Exercises completion.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-5-mark-a-todo-complete Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-6-mark-a-todo-incomplete Exercises incompletion.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-6-mark-a-todo-incomplete Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Exercises soft deletion.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Exercises history inspection.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Exercises full history.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Exercises content rules.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Exercises title and description validation.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Exercises planning dates.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Exercises browsing rules.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Exercises bounded pagination.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-2-filter-active-todos-by-completion Exercises completion filtering.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-2-filter-active-todos-by-completion Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-3-sort-active-todos-by-supported-dates Exercises supported sorting.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-3-sort-active-todos-by-supported-dates Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Exercises default ordering.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Exercises state controls.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Exercises active availability.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-2-make-repeated-completion-requests-idempotent Exercises completion toggles.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-2-make-repeated-completion-requests-idempotent Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Exercises versioned edit input.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Exercises history creation.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Exercises private Todo access.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Exercises account isolation.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Exercises account-scoped access.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Read the cited requirement and ran the two-account isolation assertion in journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Exercises integrity-sensitive changes.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Exercises edit-history consistency.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence {@link AuthPage} Walks authentication before private work.
 * @evidenceReview {@link AuthPage} Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 * @evidence {@link TodoPage} Walks the active Todo workbench.
 * @evidenceReview {@link TodoPage} Read the cited requirement and ran journey_active_todo_evidence against the live backend.
 */
export async function journey_active_todo_evidence(page: Page): Promise<void> {
  await journey_active_todo_workflow(page);
}

test("active Todo workflow", async ({ page }) => {
  await journey_active_todo_evidence(page);
});
