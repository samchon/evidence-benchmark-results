import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import * as api from "@benchmark/todo-api";

import { useHealth } from "../../lib/system/hooks";
import {
  useCompleteTodo,
  useCreateTodo,
  useIncompleteTodo,
  useTodoDetail,
  useTodoHistory,
  useTodoList,
  useTrashTodo,
  useUpdateTodo,
} from "../../lib/todo/hooks";
import { errorMessage, firstInvalid, formatCalendarDate, formatDateTime } from "@/lib/utils";
import { EmptyBlock, ErrorBlock, InlineAlert, LoadingBlock, SectionHeading } from "@/components/ui/primitives";

const sortOptions = [
  ["-createdAt", "Newest created"],
  ["+createdAt", "Oldest created"],
  ["+startDate", "Start date, earliest"],
  ["-startDate", "Start date, latest"],
  ["+dueDate", "Due date, earliest"],
  ["-dueDate", "Due date, latest"],
] as const;
type Completion = "all" | "complete-only" | "incomplete-only";

const validSort = (value: string | null): api.ITodoTodo.IRequest["sort"] => {
  const option = sortOptions.find(([key]) => key === value);
  return option === undefined ? undefined : [option[0]];
};

/**
 * Active Todo workbench, content editing, completion, and history screen.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Renders the authenticated account's private Todo surface.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Read the cited requirement and inspected the account-scoped Todo surface; ran the live two-account isolation assertion in the active-Todo journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-3-move-an-active-todo-to-trash Renders the active-to-trash transition.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-3-move-an-active-todo-to-trash Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Renders owned active Todo work.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Renders Todo content, dates, status, and version.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Renders the authenticated account workbench.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Renders active Todo lifecycle controls.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Renders completion state controls.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Renders active availability.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Renders the Todo history panel.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Renders immutable history entries.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Renders history alongside the selected Todo.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Renders active Todo operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-1-create-a-todo Renders Todo creation.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-1-create-a-todo Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-2-browse-active-todos Renders active list browsing.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-2-browse-active-todos Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-3-view-an-active-todo Renders selected Todo detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-3-view-an-active-todo Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-4-edit-todo-content Renders content editing and history.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-4-edit-todo-content Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-5-mark-a-todo-complete Renders completion.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-5-mark-a-todo-complete Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-6-mark-a-todo-incomplete Renders incompletion.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-6-mark-a-todo-incomplete Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Renders move-to-trash.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Renders history inspection.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Renders the full history list.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Renders content and date validation controls.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Renders bounded title and description fields.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Renders planning date fields.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Renders list paging, filtering, and sorting.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Renders bounded page controls.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-2-filter-active-todos-by-completion Renders completion filter.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-2-filter-active-todos-by-completion Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-3-sort-active-todos-by-supported-dates Renders supported date sorting.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-3-sort-active-todos-by-supported-dates Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Renders stable default ordering.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Renders state-aware editing controls.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Renders active-detail action scope.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-2-make-repeated-completion-requests-idempotent Renders completion toggles.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-2-make-repeated-completion-requests-idempotent Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Renders versioned edit submission.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Renders edit history after content changes.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Renders private Todo access.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Renders the account-scoped workbench.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Renders integrity-sensitive edit actions.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Renders version and history context.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence {@link useHealth} Uses the health query for shell availability.
 * @evidenceReview {@link useHealth} Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence {@link useTodoList} Uses the active Todo list query.
 * @evidenceReview {@link useTodoList} Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence {@link useTodoDetail} Uses the active Todo detail query.
 * @evidenceReview {@link useTodoDetail} Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence {@link useTodoHistory} Uses the immutable history query.
 * @evidenceReview {@link useTodoHistory} Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence {@link useCreateTodo} Uses Todo creation.
 * @evidenceReview {@link useCreateTodo} Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence {@link useUpdateTodo} Uses versioned Todo editing.
 * @evidenceReview {@link useUpdateTodo} Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence {@link useCompleteTodo} Uses completion.
 * @evidenceReview {@link useCompleteTodo} Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence {@link useIncompleteTodo} Uses incompletion.
 * @evidenceReview {@link useIncompleteTodo} Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 * @evidence {@link useTrashTodo} Uses soft deletion to trash.
 * @evidenceReview {@link useTrashTodo} Read the cited requirement and inspected TodoPage controls, query states, mutations, and history; ran the live active-Todo journey.
 */
export function TodoPage() {
  const [params, setParams] = useSearchParams();
  const [createError, setCreateError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const health = useHealth();
  const completion = (params.get("completion") as Completion | null) ?? "all";
  const safeCompletion: Completion = completion === "complete-only" || completion === "incomplete-only" ? completion : "all";
  const sort = validSort(params.get("sort"));
  const page = Math.max(1, Number(params.get("page") ?? "1") || 1);
  const request: api.ITodoTodo.IRequest = { page, limit: 8, completion: safeCompletion, sort };
  const list = useTodoList(request);
  const selectedId = params.get("todo");
  const detail = useTodoDetail(selectedId);
  const history = useTodoHistory(selectedId);
  const create = useCreateTodo();
  const update = useUpdateTodo();
  const complete = useCompleteTodo();
  const incomplete = useIncompleteTodo();
  const trash = useTrashTodo();
  const change = (values: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(values)) {
      if (value === null || value.length === 0) next.delete(key);
      else next.set(key, value);
    }
    setParams(next);
  };
  const submitCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setCreateError(null);
    if (form.reportValidity() === false) {
      firstInvalid(form);
      return;
    }
    const values = new FormData(form);
    create.mutate({ title: String(values.get("title")), description: String(values.get("description")) || null, startDate: String(values.get("startDate")) || null, dueDate: String(values.get("dueDate")) || null }, { onSuccess: () => form.reset(), onError: (reason) => setCreateError(errorMessage(reason)) });
  };
  const submitEdit = (event: FormEvent<HTMLFormElement>, id: string, version: number) => {
    event.preventDefault();
    const form = event.currentTarget;
    setEditError(null);
    if (form.reportValidity() === false) {
      firstInvalid(form);
      return;
    }
    const values = new FormData(form);
    update.mutate({ id, body: { version, title: String(values.get("title")), description: String(values.get("description")) || null, startDate: String(values.get("startDate")) || null, dueDate: String(values.get("dueDate")) || null } }, { onSuccess: () => setEditError(null), onError: (reason) => setEditError(errorMessage(reason)) });
  };
  return <div className="page-wrap"><SectionHeading eyebrow="Workspace" title="Your Todos" description="Keep the next useful action close. Every change stays inside your account." action={<span className={`pill ${health.data === "OK" ? "pill-success" : "pill-neutral"}`}><span className="status-dot" />{health.isPending ? "Checking" : health.data === "OK" ? "Backend online" : "Offline mode"}</span>} /><div className="todo-layout"><section className="card list-card"><div className="card-head"><div><p className="eyebrow">Active work</p><h2>Todo list</h2></div><span className="count-label">{list.data?.pagination.records ?? 0} items</span></div><div className="filters"><label>Completion<select aria-label="Completion filter" value={safeCompletion} onChange={(event) => change({ completion: event.target.value, page: null })}><option value="all">All statuses</option><option value="incomplete-only">In progress</option><option value="complete-only">Complete</option></select></label><label>Sort<select aria-label="Todo sort order" value={params.get("sort") ?? "-createdAt"} onChange={(event) => change({ sort: event.target.value === "-createdAt" ? null : event.target.value, page: null })}>{sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>{list.error !== null && <ErrorBlock message={errorMessage(list.error)} onRetry={() => void list.refetch()} />}{list.isPending && <LoadingBlock label="Loading active Todos" />}{list.data !== undefined && list.data.data.length === 0 && <EmptyBlock title={safeCompletion === "all" ? "Nothing here yet" : "No matching Todos"}>{safeCompletion === "all" ? "Create your first Todo to make the work visible." : "Try another completion filter."}</EmptyBlock>}{list.data !== undefined && list.data.data.length > 0 && <div className="todo-list" aria-label="Active Todos">{list.data.data.map((todo) => <button type="button" className={`todo-row ${selectedId === todo.id ? "selected" : ""}`} key={todo.id} onClick={() => change({ todo: todo.id })}><span className={`checkmark ${todo.status === "complete" ? "done" : ""}`} aria-hidden="true">{todo.status === "complete" ? "✓" : ""}</span><span className="todo-row-main"><strong>{todo.title}</strong><span>{todo.status === "complete" ? "Complete" : "In progress"} <span className="dot-separator">·</span> {formatCalendarDate(todo.dueDate)}</span></span><span className="row-date">{formatDateTime(todo.createdAt)}</span></button>)}</div>}{list.data !== undefined && <div className="pagination"><button type="button" className="button button-ghost" onClick={() => change({ page: String(Math.max(1, page - 1)) })} disabled={page <= 1}>Previous</button><span>Page {list.data.pagination.current} of {Math.max(1, list.data.pagination.pages)}</span><button type="button" className="button button-ghost" onClick={() => change({ page: String(page + 1) })} disabled={page >= list.data.pagination.pages}>Next</button></div>}</section><section className="card create-card"><div className="card-head"><div><p className="eyebrow">Capture</p><h2>New Todo</h2></div><span className="pill pill-neutral">Active</span></div>{createError !== null && <InlineAlert tone="error">{createError}</InlineAlert>}<form className="stack-form" onSubmit={submitCreate}><label>Title<input aria-label="Todo title" name="title" required minLength={1} maxLength={200} placeholder="What needs doing?" /></label><label>Description<textarea aria-label="Todo description" name="description" maxLength={10000} rows={4} placeholder="Add context if it helps" /></label><div className="form-grid"><label>Start date<input aria-label="Start date" name="startDate" type="date" /></label><label>Due date<input aria-label="Due date" name="dueDate" type="date" /></label></div><button type="submit" className="button button-primary button-wide" disabled={create.isPending}>{create.isPending ? "Creating" : "Add Todo"}</button></form></section></div>{detail.data !== undefined && <section className="card detail-card"><div className="card-head"><div><p className="eyebrow">Selected Todo</p><h2>{detail.data.title}</h2></div><button type="button" className="button button-ghost" onClick={() => change({ todo: null })}>Close detail</button></div>{detail.error !== null && <InlineAlert tone="error">{errorMessage(detail.error)}</InlineAlert>}{editError !== null && <InlineAlert tone="error">{editError}</InlineAlert>}<form key={`${detail.data.id}-${detail.data.version}`} className="edit-grid" onSubmit={(event) => submitEdit(event, detail.data.id, detail.data.version)}><div className="edit-fields"><label>Title<input aria-label="Edit Todo title" name="title" defaultValue={detail.data.title} required minLength={1} maxLength={200} /></label><label>Description<textarea aria-label="Edit Todo description" name="description" defaultValue={detail.data.description ?? ""} maxLength={10000} rows={5} /></label><div className="form-grid"><label>Start date<input aria-label="Edit start date" name="startDate" type="date" defaultValue={detail.data.startDate ?? ""} /></label><label>Due date<input aria-label="Edit due date" name="dueDate" type="date" defaultValue={detail.data.dueDate ?? ""} /></label></div><button type="submit" className="button button-primary" disabled={update.isPending}>{update.isPending ? "Saving" : "Save changes"}</button></div><aside className="detail-aside"><div className="fact"><span>Status</span><strong>{detail.data.status === "complete" ? "Complete" : "In progress"}</strong></div><div className="fact"><span>Availability</span><strong>{detail.data.availability}</strong></div><div className="fact"><span>Created</span><strong>{formatDateTime(detail.data.createdAt)}</strong></div><div className="fact"><span>Version</span><strong>{detail.data.version}</strong></div><div className="button-stack"><button type="button" className="button button-secondary" onClick={() => (detail.data?.status === "complete" ? incomplete : complete).mutate(detail.data?.id ?? "")} disabled={complete.isPending || incomplete.isPending}>{detail.data.status === "complete" ? "Mark incomplete" : "Mark complete"}</button><button type="button" className="button button-secondary" onClick={() => trash.mutate(detail.data?.id ?? "")} disabled={trash.isPending}>{trash.isPending ? "Moving" : "Move to trash"}</button></div></aside></form><div className="history-panel"><div className="subhead"><div><p className="eyebrow">Immutable record</p><h3>Edit history</h3></div><span className="muted">{history.data?.length ?? 0} edits</span></div>{history.isPending && <LoadingBlock label="Loading history" />}{history.error !== null && <InlineAlert tone="error">{errorMessage(history.error)}</InlineAlert>}{history.data !== undefined && history.data.length === 0 && <p className="muted">No content edits yet.</p>}{history.data !== undefined && history.data.length > 0 && <ol className="history-list">{history.data.map((entry) => <li key={entry.id}><time>{formatDateTime(entry.createdAt)}</time><span>{entry.title !== undefined && `Title: ${entry.title}`}{entry.description !== undefined && `Description ${entry.description === null ? "cleared" : "updated"}`}{entry.startDate !== undefined && `Start date ${entry.startDate === null ? "cleared" : "updated"}`}{entry.dueDate !== undefined && `Due date ${entry.dueDate === null ? "cleared" : "updated"}`}</span></li>)}</ol>}</div></section>}{detail.isPending && selectedId !== null && <div className="card"><LoadingBlock label="Loading Todo detail" /></div>}</div>;
}
