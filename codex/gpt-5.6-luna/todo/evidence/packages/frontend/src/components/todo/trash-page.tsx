import { useSearchParams } from "react-router-dom";
import * as api from "@benchmark/todo-api";

import {
  usePermanentDeleteTodo,
  useRestoreTodo,
  useTodoHistory,
  useTrashDetail,
  useTrashList,
} from "../../lib/todo/hooks";
import { errorMessage, formatCalendarDate, formatDateTime } from "@/lib/utils";
import { EmptyBlock, ErrorBlock, InlineAlert, LoadingBlock, SectionHeading } from "@/components/ui/primitives";

/**
 * Retained Todo recovery and permanent-deletion screen.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Renders retained Todo lifecycle actions.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-4-restore-a-trashed-todo Renders restore from trash.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-4-restore-a-trashed-todo Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-5-permanently-delete-a-trashed-todo Renders permanent deletion.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-5-permanently-delete-a-trashed-todo Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Renders preserved history.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Renders history across the trash lifecycle.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Renders the trash recovery journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-1-browse-trashed-todos Renders trashed list browsing.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-1-browse-trashed-todos Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-2-view-a-trashed-todo Renders trashed detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-2-view-a-trashed-todo Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-3-restore-a-todo-from-trash Renders restore action.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-3-restore-a-todo-from-trash Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-4-permanently-delete-a-todo-from-trash Renders terminal Todo deletion.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-4-permanently-delete-a-todo-from-trash Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Renders bounded trash paging.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Renders stable retained ordering.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Renders integrity-sensitive recovery actions.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Renders retained content and history before restore.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Renders explicit permanent deletion confirmation.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence {@link useTrashList} Uses the trashed Todo list query.
 * @evidenceReview {@link useTrashList} Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence {@link useTrashDetail} Uses the trashed Todo detail query.
 * @evidenceReview {@link useTrashDetail} Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence {@link useTodoHistory} Uses preserved history inspection.
 * @evidenceReview {@link useTodoHistory} Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence {@link useRestoreTodo} Uses restore from trash.
 * @evidenceReview {@link useRestoreTodo} Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 * @evidence {@link usePermanentDeleteTodo} Uses terminal Todo deletion.
 * @evidenceReview {@link usePermanentDeleteTodo} Read the cited requirement and inspected TrashPage list, detail, history, and recovery controls; ran the live trash journey.
 */
export function TrashPage() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page") ?? "1") || 1);
  const request: api.IPage.IRequest = { page, limit: 8 };
  const list = useTrashList(request);
  const selectedId = params.get("todo");
  const detail = useTrashDetail(selectedId);
  const history = useTodoHistory(selectedId);
  const restore = useRestoreTodo();
  const permanentDelete = usePermanentDeleteTodo();
  const select = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id === null) next.delete("todo");
    else next.set("todo", id);
    setParams(next);
  };
  return <div className="page-wrap"><SectionHeading eyebrow="Recovery" title="Trash" description="Soft-deleted Todos stay recoverable with their complete history until you decide otherwise." action={<span className="pill pill-neutral">{list.data?.pagination.records ?? 0} retained</span>} /><div className="todo-layout"><section className="card list-card"><div className="card-head"><div><p className="eyebrow">Retained work</p><h2>Trash list</h2></div><span className="muted">Newest deletion first</span></div>{list.error !== null && <ErrorBlock message={errorMessage(list.error)} onRetry={() => void list.refetch()} />}{list.isPending && <LoadingBlock label="Loading trash" />}{list.data !== undefined && list.data.data.length === 0 && <EmptyBlock title="Trash is clear">Deleted Todos will appear here until restored or permanently removed.</EmptyBlock>}{list.data !== undefined && list.data.data.length > 0 && <div className="todo-list" aria-label="Trashed Todos">{list.data.data.map((todo) => <button type="button" className={`todo-row ${selectedId === todo.id ? "selected" : ""}`} key={todo.id} onClick={() => select(todo.id)}><span className="trash-symbol" aria-hidden="true">⌁</span><span className="todo-row-main"><strong>{todo.title}</strong><span>{todo.status === "complete" ? "Complete" : "In progress"} <span className="dot-separator">·</span> Deleted {formatDateTime(todo.trashedAt)}</span></span><span className="row-date">Due {formatCalendarDate(todo.dueDate)}</span></button>)}</div>}{list.data !== undefined && <div className="pagination"><button type="button" className="button button-ghost" onClick={() => { const next = new URLSearchParams(params); next.set("page", String(Math.max(1, page - 1))); setParams(next); }} disabled={page <= 1}>Previous</button><span>Page {list.data.pagination.current} of {Math.max(1, list.data.pagination.pages)}</span><button type="button" className="button button-ghost" onClick={() => { const next = new URLSearchParams(params); next.set("page", String(page + 1)); setParams(next); }} disabled={page >= list.data.pagination.pages}>Next</button></div>}</section><section className="card recovery-card">{selectedId === null && <EmptyBlock title="Choose a retained Todo">Inspect its preserved content before restoring it or making the deletion permanent.</EmptyBlock>}{selectedId !== null && detail.isPending && <LoadingBlock label="Loading retained Todo" />}{detail.error !== null && <ErrorBlock message={errorMessage(detail.error)} />}{detail.data !== undefined && <><div className="card-head"><div><p className="eyebrow">Trash detail</p><h2>{detail.data.title}</h2></div><button type="button" className="button button-ghost" onClick={() => select(null)}>Close</button></div><dl className="fact-list"><div><dt>Description</dt><dd>{detail.data.description || "No description"}</dd></div><div><dt>Dates</dt><dd>{formatCalendarDate(detail.data.startDate)} to {formatCalendarDate(detail.data.dueDate)}</dd></div><div><dt>Status</dt><dd>{detail.data.status === "complete" ? "Complete" : "In progress"}</dd></div><div><dt>Moved to trash</dt><dd>{formatDateTime(detail.data.trashedAt)}</dd></div></dl><div className="button-row"><button type="button" className="button button-primary" onClick={() => restore.mutate(detail.data?.id ?? "", { onSuccess: () => select(null), onError: () => undefined })} disabled={restore.isPending}>{restore.isPending ? "Restoring" : "Restore to active"}</button><button type="button" className="button button-danger" onClick={() => { if (window.confirm("Permanently delete this Todo and its history?")) permanentDelete.mutate(detail.data?.id ?? "", { onSuccess: () => select(null) }); }} disabled={permanentDelete.isPending}>{permanentDelete.isPending ? "Deleting" : "Delete permanently"}</button></div>{(restore.error !== null || permanentDelete.error !== null) && <InlineAlert tone="error">{errorMessage(restore.error ?? permanentDelete.error)}</InlineAlert>}<div className="history-panel"><div className="subhead"><div><p className="eyebrow">Preserved record</p><h3>Edit history</h3></div><span className="muted">{history.data?.length ?? 0} edits</span></div>{history.isPending && <LoadingBlock label="Loading history" />}{history.error !== null && <InlineAlert tone="error">{errorMessage(history.error)}</InlineAlert>}{history.data !== undefined && history.data.length === 0 && <p className="muted">No content edits were recorded.</p>}{history.data !== undefined && history.data.length > 0 && <ol className="history-list">{history.data.map((entry) => <li key={entry.id}><time>{formatDateTime(entry.createdAt)}</time><span>{entry.title ?? "Content fields changed"}</span></li>)}</ol>}</div></>}</section></div></div>;
}
