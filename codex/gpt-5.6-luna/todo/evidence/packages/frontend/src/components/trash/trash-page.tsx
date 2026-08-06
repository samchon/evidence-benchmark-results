import { useSearchParams } from "react-router-dom";
import * as api from "@benchmark/todo-api";

import { useTodoHistory, useTrashDetail, useTrashErase, useTrashIndex, useTrashRestore } from "../../lib/todo/hooks";
import { errorMessage, formatCalendar, formatInstant } from "@/lib/utils";
import { Button, EmptyState, LoadingState, Notice, Panel } from "@/components/ui/ui";

/**
 * Retained Todo recovery screen.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Keeps retained task meaning.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Presents recovery lifecycle.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Presents trashed availability.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-4-restore-a-trashed-todo Presents restoration.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-5-permanently-delete-a-trashed-todo Presents terminal deletion.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Keeps history with the task.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Keeps retained history attached.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Delivers recovery work.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-1-browse-trashed-todos Browses retained tasks.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-2-view-a-trashed-todo Views retained detail.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-3-restore-a-todo-from-trash Restores a retained task.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-4-permanently-delete-a-todo-from-trash Permanently deletes a retained task.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Preserves retained history access.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Shows retained history.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Uses recovery list ordering.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Presents shared page bounds.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Preserves stable recovery order.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Presents state-qualified actions.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Keeps recovery actions trashed-only.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Displays immutable history.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps recovery private.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Keeps one owner's trash boundary.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Keeps recovery outcomes linked.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Shows the same task across recovery.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Shows terminal removal.
 * @evidence {@link useTrashIndex} Uses trash list hook.
 * @evidence {@link useTrashDetail} Uses trash detail hook.
 * @evidence {@link useTodoHistory} Uses retained history hook.
 * @evidence {@link useTrashRestore} Uses restore hook.
 * @evidence {@link useTrashErase} Uses permanent erase hook.
 */
export function TrashPage() {
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("todo") ?? undefined;
  const page = Math.max(1, Number(params.get("page") ?? "1"));
  const list = useTrashIndex({ page, limit: 20 });
  const detail = useTrashDetail(selectedId);
  const history = useTodoHistory(selectedId);
  const restore = useTrashRestore();
  const erase = useTrashErase();

  const selectTodo = (id: string) => setParams((current) => { current.set("todo", id); return current; });
  const setPage = (next: number) => setParams((current) => { current.set("page", String(Math.max(1, next))); current.delete("todo"); return current; });
  const trashPagination = list.data === undefined ? null : <div className="pagination" aria-label="Trash pages"><span>Page {list.data.pagination.current} of {Math.max(1, list.data.pagination.pages)} · {list.data.pagination.records} tasks</span><span className="button-row"><button type="button" className="button button-quiet" disabled={list.data.pagination.current <= 1} onClick={() => setPage(list.data.pagination.current - 1)}>Previous</button><button type="button" className="button button-quiet" disabled={list.data.pagination.current >= list.data.pagination.pages} onClick={() => setPage(list.data.pagination.current + 1)}>Next</button></span></div>;
  const listBody = list.isPending ? <LoadingState label="Loading trash" /> : list.error ? <Notice tone="error">{errorMessage(list.error)}</Notice> : list.data === undefined ? <EmptyState title="Trash is empty" message="Soft-deleted tasks will appear here until you restore or permanently erase them." /> : list.data.data.length === 0 ? <>{<EmptyState title="Trash is empty" message="Soft-deleted tasks will appear here until you restore or permanently erase them." />}{trashPagination}</> : <><ul className="todo-list">{list.data.data.map((todo) => <li key={todo.id}><button type="button" className={selectedId === todo.id ? "todo-row selected" : "todo-row"} onClick={() => selectTodo(todo.id)}><span className="todo-row-main"><strong>{todo.title}</strong><small>{todo.completed ? "Complete" : "In progress"}<br />Start {formatCalendar(todo.startDate)} · Due {formatCalendar(todo.dueDate)}<br />Created {formatInstant(todo.createdAt)}</small></span><span className="todo-row-date">{formatInstant(todo.trashedAt)}</span></button></li>)}</ul>{trashPagination}</>;
  const detailBody = detail.isPending ? <LoadingState label="Loading retained task" /> : detail.error ? <Notice tone="error">{errorMessage(detail.error)}</Notice> : detail.data === undefined ? <EmptyState title="Choose a retained task" message="Select an item to inspect its preserved content and history." /> : <>
    <div className="detail-header"><div><p className="eyebrow">Retained task</p><h3>{detail.data.title}</h3></div><span className="state-pill trashed">Trashed</span></div>
    <dl className="detail-grid"><div><dt>Description</dt><dd>{detail.data.description ?? "No description"}</dd></div><div><dt>Completion</dt><dd>{detail.data.completed ? "Complete" : "In progress"}</dd></div><div><dt>Start</dt><dd>{formatCalendar(detail.data.startDate)}</dd></div><div><dt>Due</dt><dd>{formatCalendar(detail.data.dueDate)}</dd></div><div><dt>Created</dt><dd>{formatInstant(detail.data.createdAt)}</dd></div><div><dt>Moved to trash</dt><dd>{formatInstant(detail.data.trashedAt)}</dd></div></dl>
    <div className="button-row" role="group" aria-label="Trash actions"><Button role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") event.currentTarget.click(); }} type="button" disabled={restore.isPending} onClick={() => { void restore.mutate(detail.data.id, { onSuccess: () => setParams((current) => { current.delete("todo"); return current; }) }); }}>{restore.isPending ? "Restoring" : "Restore task"}</Button><Button role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") event.currentTarget.click(); }} tone="danger" type="button" disabled={erase.isPending} onClick={() => { void erase.mutate(detail.data.id, { onSuccess: () => setParams((current) => { current.delete("todo"); return current; }) }); }}>{erase.isPending ? "Erasing" : "Permanently erase"}</Button></div>
    <div className="history-block"><h4>Preserved edit history</h4>{history.isPending ? <LoadingState label="Loading history" /> : history.error ? <Notice tone="error">{errorMessage(history.error)}</Notice> : history.data === undefined || history.data.length === 0 ? <p className="muted">No content edits were recorded.</p> : <ol className="history-list">{history.data.map((entry) => <li key={entry.id}><time>{formatInstant(entry.createdAt)}</time><span>{entry.title === undefined ? "Content edit" : `Title became ${entry.title}`}</span></li>)}</ol>}</div>
  </>;

  return <div className="page-stack"><header className="page-heading"><div><p className="eyebrow">Recovery</p><h1>Trash</h1><p className="lede">Recover the same task when you still need it, or make a deliberate terminal deletion.</p></div></header><div className="dashboard-grid"><Panel title="Retained Todos" eyebrow="Newest moved first" className="list-card">{listBody}</Panel><Panel title="Recovery detail" eyebrow="One selected task">{detailBody}</Panel></div></div>;
}
