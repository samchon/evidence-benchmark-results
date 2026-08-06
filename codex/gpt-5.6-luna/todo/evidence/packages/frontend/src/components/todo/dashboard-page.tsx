import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import typia from "typia";
import * as api from "@benchmark/todo-api";

import { useProfile, useProfileUpdate } from "../../lib/profile/hooks";
import { useHealth } from "../../lib/system/hooks";
import { useTodoCompletion, useTodoCreate, useTodoDetail, useTodoHistory, useTodoIndex, useTodoTrash, useTodoUpdate } from "../../lib/todo/hooks";
import { diagnoses, errorMessage, firstDiagnosis, formatCalendar, formatInstant } from "@/lib/utils";
import { Button, DiagnosisList, EmptyState, Field, LoadingState, Notice, Panel, SelectField } from "@/components/ui/ui";

function dateInputValue(value: string | null | undefined): string {
  return value === null || value === undefined ? "" : value.slice(0, 10);
}

function dateTimeValue(value: FormDataEntryValue | null): string | null | undefined {
  if (typeof value !== "string") return undefined;
  return value.length === 0 ? null : `${value}T00:00:00.000Z`;
}

/**
 * Authenticated planning workspace for profile, active Todo, and history work.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Presents the private profile workspace.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-1-define-the-user-profile Presents the profile identity.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Keeps profile ownership private.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Delivers profile operations.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-1-view-the-current-users-profile Displays the current profile.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-2-edit-the-display-name Edits the display name.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Presents owned Todo work.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Presents complete task values.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Keeps task ownership private.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Presents independent task lifecycle.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Presents completion state.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Presents active availability.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-3-move-an-active-todo-to-trash Presents the trash transition.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Delivers the active Todo surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-1-create-a-todo Creates an active Todo.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-2-browse-active-todos Browses active Todos.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-3-view-an-active-todo Views active Todo detail.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-4-edit-todo-content Edits Todo content.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-5-mark-a-todo-complete Marks a Todo complete.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-6-mark-a-todo-incomplete Marks a Todo incomplete.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Starts recovery state.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Presents content history.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Views full edit history.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Validates task content.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Preserves title and description boundaries.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Preserves date boundaries.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Presents list controls.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Presents page controls.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-2-filter-active-todos-by-completion Presents completion filters.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-3-sort-active-todos-by-supported-dates Presents date sorting.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Preserves ordered results.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Handles Todo state and conflict feedback.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Keeps active commands active-only.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-2-make-repeated-completion-requests-idempotent Renders completion retry results.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Preserves stale and no-op refusal feedback.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Refreshes the matching history.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps workspace data private.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Uses one authenticated boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Operates behind the authenticated boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Refreshes linked Todo views together.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Refreshes detail and history together.
 * @evidence {@link useHealth} Uses health hook.
 * @evidence {@link useProfile} Uses profile hook.
 * @evidence {@link useProfileUpdate} Uses profile update hook.
 * @evidence {@link useTodoIndex} Uses active list hook.
 * @evidence {@link useTodoDetail} Uses active detail hook.
 * @evidence {@link useTodoHistory} Uses history hook.
 * @evidence {@link useTodoCreate} Uses creation hook.
 * @evidence {@link useTodoUpdate} Uses update hook.
 * @evidence {@link useTodoCompletion} Uses completion hook.
 * @evidence {@link useTodoTrash} Uses trash hook.
 */
export function DashboardPage() {
  const [params, setParams] = useSearchParams();
  const filter = params.get("filter") ?? "all";
  const sort = params.get("sort") ?? "createdAt";
  const direction = params.get("direction") ?? "desc";
  const page = Math.max(1, Number(params.get("page") ?? "1"));
  const selectedId = params.get("todo") ?? undefined;
  const request: api.ITodoRequest = { page, limit: 20, filter: filter as api.ITodoRequest["filter"], sort: sort as api.ITodoRequest["sort"], direction: direction as api.ITodoRequest["direction"] };
  const profile = useProfile();
  const health = useHealth();
  const list = useTodoIndex(request);
  const detail = useTodoDetail(selectedId);
  const history = useTodoHistory(selectedId);
  const create = useTodoCreate();
  const update = useTodoUpdate();
  const completion = useTodoCompletion();
  const trash = useTodoTrash();
  const profileUpdate = useProfileUpdate();
  const [profileName, setProfileName] = useState("");
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createStart, setCreateStart] = useState("");
  const [createDue, setCreateDue] = useState("");
  const [errors, setErrors] = useState<api.IDiagnosis[]>([]);

  const selectTodo = (id: string) => setParams((current) => { current.set("todo", id); return current; });
  const setBrowse = (key: "filter" | "sort" | "direction", value: string) => setParams((current) => { current.set(key, value); current.delete("todo"); current.delete("page"); return current; });
  const setPage = (next: number) => setParams((current) => { current.set("page", String(Math.max(1, next))); current.delete("todo"); return current; });

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = { displayName: profileName } satisfies api.IProfileUpdate;
    const result = typia.validate<api.IProfileUpdate>(body);
    if (!result.success) { setErrors(result.errors.map((item) => ({ accessor: item.path.replace(/^\$input(?:\.|$)/, ""), message: item.expected }))); return; }
    profileUpdate.mutate(body, { onSuccess: () => { setProfileName(""); setErrors([]); }, onError: (error) => setErrors(diagnoses(error)) });
  };

  const submitCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body: api.ITodoCreate = { title: createTitle };
    if (createDescription.length > 0) body.description = createDescription;
    if (createStart.length > 0) body.startDate = `${createStart}T00:00:00.000Z`;
    if (createDue.length > 0) body.dueDate = `${createDue}T00:00:00.000Z`;
    const result = typia.validate<api.ITodoCreate>(body);
    if (!result.success) { setErrors(result.errors.map((item) => ({ accessor: item.path.replace(/^\$input(?:\.|$)/, ""), message: item.expected }))); return; }
    create.mutate(body, { onSuccess: (todo) => { setCreateTitle(""); setCreateDescription(""); setCreateStart(""); setCreateDue(""); selectTodo(todo.id); setErrors([]); }, onError: (error) => setErrors(diagnoses(error)) });
  };

  const submitUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedId === undefined || detail.data === undefined) return;
    const form = new FormData(event.currentTarget);
    const body: api.ITodoUpdate = {
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? "").length === 0 ? null : String(form.get("description")),
      startDate: dateTimeValue(form.get("startDate")),
      dueDate: dateTimeValue(form.get("dueDate")),
      expectedUpdatedAt: detail.data.updatedAt,
    };
    const result = typia.validate<api.ITodoUpdate>(body);
    if (!result.success) { setErrors(result.errors.map((item) => ({ accessor: item.path.replace(/^\$input(?:\.|$)/, ""), message: item.expected }))); return; }
    update.mutate({ id: selectedId, body }, { onSuccess: () => setErrors([]), onError: (error) => setErrors(diagnoses(error)) });
  };

  const activePagination = list.data === undefined ? null : <div className="pagination" aria-label="Active Todo pages"><span>Page {list.data.pagination.current} of {Math.max(1, list.data.pagination.pages)} · {list.data.pagination.records} tasks</span><span className="button-row"><button type="button" className="button button-quiet" disabled={list.data.pagination.current <= 1} onClick={() => setPage(list.data.pagination.current - 1)}>Previous</button><button type="button" className="button button-quiet" disabled={list.data.pagination.current >= list.data.pagination.pages} onClick={() => setPage(list.data.pagination.current + 1)}>Next</button></span></div>;
  const listBody = list.isPending ? <LoadingState label="Loading active tasks" /> : list.error ? <Notice tone="error">{errorMessage(list.error)}</Notice> : list.data === undefined ? <EmptyState title="Your active list is clear" message={filter === "all" ? "Create a Todo to give the workspace its first next step." : "Nothing matches this filter yet."} /> : list.data.data.length === 0 ? <>{<EmptyState title="Your active list is clear" message={filter === "all" ? "Create a Todo to give the workspace its first next step." : "Nothing matches this filter yet."} />}{activePagination}</> : <><ul className="todo-list">{list.data.data.map((todo) => <li key={todo.id}><button type="button" className={selectedId === todo.id ? "todo-row selected" : "todo-row"} onClick={() => selectTodo(todo.id)}><span className="todo-row-main"><strong>{todo.title}</strong><small>{todo.completed ? "Complete" : "In progress"}<br />Start {formatCalendar(todo.startDate)} · Due {formatCalendar(todo.dueDate)}<br />Created {formatInstant(todo.createdAt)}</small></span><span className="todo-row-date">{formatCalendar(todo.dueDate)}</span></button></li>)}</ul>{activePagination}</>;
  const detailBody = detail.isPending ? <LoadingState label="Loading task detail" /> : detail.error ? <Notice tone="error">{errorMessage(detail.error)}</Notice> : detail.data === undefined ? <EmptyState title="Choose a task" message="Select a task to inspect its details and history." /> : <>
    <div className="detail-header"><div><p className="eyebrow">Selected task</p><h3>{detail.data.title}</h3></div><span className={`state-pill ${detail.data.completed ? "complete" : "active"}`}>{detail.data.completed ? "Complete" : "In progress"}</span></div>
    <dl className="detail-grid"><div><dt>Description</dt><dd>{detail.data.description ?? "No description"}</dd></div><div><dt>Start</dt><dd>{formatCalendar(detail.data.startDate)}</dd></div><div><dt>Due</dt><dd>{formatCalendar(detail.data.dueDate)}</dd></div><div><dt>Created</dt><dd>{formatInstant(detail.data.createdAt)}</dd></div><div><dt>Updated</dt><dd>{formatInstant(detail.data.updatedAt)}</dd></div></dl>
    <div className="button-row" role="group" aria-label="Todo actions"><Button role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") event.currentTarget.click(); }} type="button" disabled={completion.isPending} onClick={() => { void completion.mutate({ id: detail.data.id, completed: !detail.data.completed }); }}>{detail.data.completed ? "Mark in progress" : "Mark complete"}</Button><Button role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") event.currentTarget.click(); }} tone="quiet" type="button" disabled={trash.isPending} onClick={() => { void trash.mutate(detail.data.id, { onSuccess: () => setParams((current) => { current.delete("todo"); return current; }) }); }}>Move to trash</Button></div>
    <form className="stack-form compact-form" onSubmit={submitUpdate} key={detail.data.id}>
      <Field label="Title" name="title" defaultValue={detail.data.title} required />
      <label className="field" htmlFor="description"><span>Description</span><textarea aria-label="Description" id="description" name="description" className="input textarea" defaultValue={detail.data.description ?? ""} /></label>
      <div className="form-grid"><Field label="Start date" name="startDate" type="date" defaultValue={dateInputValue(detail.data.startDate)} /><Field label="Due date" name="dueDate" type="date" defaultValue={dateInputValue(detail.data.dueDate)} /></div>
      <Button type="submit" disabled={update.isPending}>{update.isPending ? "Saving" : "Save task"}</Button>
    </form>
    <div className="history-block"><h4>Edit history</h4>{history.isPending ? <LoadingState label="Loading history" /> : history.error ? <Notice tone="error">{errorMessage(history.error)}</Notice> : history.data === undefined || history.data.length === 0 ? <p className="muted">No content edits yet.</p> : <ol className="history-list">{history.data.map((entry) => <li key={entry.id}><time>{formatInstant(entry.createdAt)}</time><span>{entry.title === undefined ? "Content edit" : `Title became ${entry.title}`}</span></li>)}</ol>}</div>
  </>;

  return (
    <div className="page-stack">
      <header className="page-heading"><div><p className="eyebrow">Today</p><h1>Your workspace</h1><p className="lede">Plan the next useful thing, keep its context close, and leave a clean trail of edits.</p></div><div className="service-status" role="status"><span className={health.isError ? "status-dot error" : "status-dot"} />{health.isPending ? "Checking service" : health.isError ? "Service needs attention" : "Service connected"}</div></header>
      <DiagnosisList items={errors} />
      <div className="dashboard-grid">
        <div className="main-column">
          <Panel title="Active Todos" eyebrow="Normal work" className="list-card">
            <div className="toolbar"><SelectField label="Filter" aria-label="Todo filter" value={filter} onChange={(event) => setBrowse("filter", event.target.value)}><option value="all">All tasks</option><option value="complete-only">Complete only</option><option value="incomplete-only">In progress only</option></SelectField><SelectField label="Sort" aria-label="Todo sort" value={sort} onChange={(event) => setBrowse("sort", event.target.value)}><option value="createdAt">Created</option><option value="startDate">Start date</option><option value="dueDate">Due date</option></SelectField><SelectField label="Direction" aria-label="Todo direction" value={direction} onChange={(event) => setBrowse("direction", event.target.value)}><option value="desc">Newest first</option><option value="asc">Oldest first</option></SelectField></div>
            {listBody}
          </Panel>
          <Panel title="Add a Todo" eyebrow="Capture" className="create-card"><form className="stack-form" onSubmit={submitCreate}><Field label="Title" name="create-title" value={createTitle} onChange={(event) => setCreateTitle(event.target.value)} placeholder="What needs your attention?" required /><label className="field" htmlFor="create-description"><span>Description <em>optional</em></span><textarea aria-label="Create description" id="create-description" className="input textarea" value={createDescription} onChange={(event) => setCreateDescription(event.target.value)} placeholder="Keep the useful context here" /></label><div className="form-grid"><Field label="Start date" type="date" value={createStart} onChange={(event) => setCreateStart(event.target.value)} /><Field label="Due date" type="date" value={createDue} onChange={(event) => setCreateDue(event.target.value)} /></div><Button type="submit" disabled={create.isPending}>{create.isPending ? "Creating" : "Create Todo"}</Button></form></Panel>
        </div>
        <div className="side-column">
          <Panel title="Profile" eyebrow="Your private identity"><p className="profile-name">{profile.isPending ? "Loading" : profile.data?.displayName ?? "Profile unavailable"}</p><p className="muted">Only you can see this display name.</p><form className="inline-form" onSubmit={submitProfile}><Field label="New display name" value={profileName} onChange={(event) => setProfileName(event.target.value)} placeholder={profile.data?.displayName ?? "Display name"} required /><Button type="submit" disabled={profileUpdate.isPending}>{profileUpdate.isPending ? "Saving" : "Update"}</Button></form></Panel>
          <Panel title="Task detail" eyebrow="Selected work">{detailBody}</Panel>
          <Panel title="Recovery" eyebrow="Keep control"><p className="muted">Tasks moved to trash stay recoverable until you permanently erase them.</p><Link className="button button-quiet button-link" to="/trash">Open trash</Link></Panel>
        </div>
      </div>
    </div>
  );
}
