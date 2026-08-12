import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type { ITodo, ITodoHistory } from "@benchmark/todo-api";

import { PageHeader } from "@/components/common/app-shell";
import { TodoHistory } from "@/components/todo/todo-history";
import {
  formatError,
  useEraseTodo,
  useRestoreTodo,
  useTodoHistory,
  useTrashDetail,
  useTrashList,
} from "@/lib/api-hooks";
import { formatCalendarDate, formatInstant, readUuid } from "@/lib/utils";

export function TrashPage() {
  const [params, setParams] = useSearchParams();
  const selectedId = readUuid(params.get("todo"));
  const pageValue = Number(params.get("page"));
  const page = Number.isInteger(pageValue) && pageValue >= 1 ? pageValue : 1;
  const list = useTrashList(page, 8);
  const detail = useTrashDetail(selectedId);
  const history = useTodoHistory(selectedId);
  const restore = useRestoreTodo();
  const erase = useEraseTodo();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);
  const selected = detail.data;
  const hasRows = (list.data?.data.length ?? 0) > 0;

  const setSelected = (id: string | null) => {
    setParams((current) => {
      if (id === null) current.delete("todo");
      else current.set("todo", id);
      return current;
    });
  };

  const setPage = (next: number) => {
    setParams((current) => {
      if (next === 1) current.delete("page");
      else current.set("page", String(next));
      return current;
    });
  };

  const run = async (
    action: () => Promise<unknown>,
    success: string,
  ): Promise<boolean> => {
    if (actionPending) return false;
    setActionPending(true);
    setActionError(null);
    try {
      await action();
      toast.success(success);
      return true;
    } catch (error) {
      setActionError(formatError(error));
      return false;
    } finally {
      setActionPending(false);
    }
  };

  return (
    <div className="content-wrap">
      <PageHeader
        eyebrow="A safe place for pauses"
        title="Trash"
        description="Recover a todo when you change your mind, or erase it permanently when you are sure."
      />
      <section className="trash-callout">
        <span aria-hidden="true">!</span>
        <div>
          <strong>Recoverable for as long as you need</strong>
          <p>
            Trash keeps the full todo and its edit history intact. Restore
            returns it to active work without adding a history entry.
          </p>
        </div>
      </section>
      {actionError && <p className="inline-error" role="alert">{actionError}</p>}
      {(list.isPending || (list.isFetching && !hasRows)) && (
        <div className="state-card card">
          <span className="spinner" />
          <p>Loading your trash...</p>
        </div>
      )}
      {list.isError && (
        <div className="state-card card error-state">
          <p>We could not load your trash.</p>
          <button type="button" className="button secondary" onClick={() => void list.refetch()}>
            Try again
          </button>
        </div>
      )}
      {!list.isPending && !list.isFetching && !list.isError && !hasRows && selectedId === null && (
        <div className="empty-card card">
          <div className="empty-icon" aria-hidden="true">+</div>
          <h2>Trash is empty</h2>
          <p>Good. There is nothing waiting for a decision.</p>
        </div>
      )}
      {!list.isPending && !list.isFetching && !list.isError && (hasRows || selectedId !== null) && (
        <div className="todo-layout">
          <div className="todo-list" aria-label="Trashed todos">
            {list.data?.data.map((todo) => (
              <TrashRow
                key={todo.id}
                todo={todo}
                selected={selectedId === todo.id}
                onSelect={() => setSelected(todo.id)}
              />
            ))}
            {list.data?.pagination && (
              <div className="pagination">
                <span>
                  Page {page} of {Math.max(1, list.data.pagination.pages)}
                </span>
                <div>
                  <button
                    type="button"
                    className="button small secondary"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="button small secondary"
                    disabled={page >= list.data.pagination.pages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
          {selectedId && (
            <aside className="detail-panel card">
              {detail.isPending ? (
                <>
                  <span className="spinner" />
                  Loading preserved detail...
                </>
              ) : detail.isError || selected === undefined ? (
                <div className="error-state">
                  <p>We could not load this trashed todo.</p>
                  <button type="button" className="button secondary" onClick={() => void detail.refetch()}>
                    Try again
                  </button>
                </div>
              ) : (
                <TrashDetail
                  todo={selected}
                  history={history.data}
                  pending={actionPending}
                  historyError={history.isError}
                  onHistoryRetry={() => void history.refetch()}
                  onRestore={() => {
                    void run(() => restore.mutateAsync(selected.id), "Todo restored").then((success) => {
                      if (success) setSelected(null);
                    });
                  }}
                  onErase={() => {
                    if (window.confirm("Erase this todo and its history permanently?"))
                      void run(() => erase.mutateAsync(selected.id), "Todo erased").then((success) => {
                        if (success) setSelected(null);
                      });
                  }}
                  onClose={() => setSelected(null)}
                />
              )}
            </aside>
          )}
        </div>
      )}
    </div>
  );
}

function TrashRow(props: {
  todo: ITodo.ITrashSummary;
  selected: boolean;
  onSelect: () => void;
}) {
  const start = props.todo.startDate === null
    ? "No start date"
    : `Start ${formatCalendarDate(props.todo.startDate)}`;
  const due = props.todo.dueDate === null
    ? "No due date"
    : `Due ${formatCalendarDate(props.todo.dueDate)}`;
  return (
    <article className={props.selected ? "todo-row selected" : "todo-row"}>
      <button type="button" className="todo-row-main" onClick={props.onSelect}>
        <strong>{props.todo.title}</strong>
        <span>
          {props.todo.completion === "complete" ? "Complete" : "In progress"} · {start} · {due}
        </span>
        <span>
          Created {formatInstant(props.todo.createdAt)} · Moved {formatInstant(props.todo.trashedAt)}
        </span>
      </button>
      <span className="chevron" aria-hidden="true">›</span>
    </article>
  );
}

function TrashDetail(props: {
  todo: ITodo;
  history: ITodoHistory[] | undefined;
  pending: boolean;
  historyError: boolean;
  onHistoryRetry: () => void;
  onRestore: () => void;
  onErase: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="detail-head">
        <div>
          <p className="eyebrow">Preserved detail</p>
          <h2>{props.todo.title}</h2>
        </div>
        <button type="button" className="icon-button" aria-label="Close detail" onClick={props.onClose}>
          ×
        </button>
      </div>
      <span className="pill neutral">In trash</span>
      <span className={props.todo.completion === "complete" ? "pill success" : "pill warm"}>
        {props.todo.completion === "complete" ? "Complete" : "In progress"}
      </span>
      <p className="detail-description">{props.todo.description ?? "No description saved."}</p>
      <dl className="detail-meta">
        <div><dt>Start</dt><dd>{formatCalendarDate(props.todo.startDate)}</dd></div>
        <div><dt>Due</dt><dd>{formatCalendarDate(props.todo.dueDate)}</dd></div>
        <div><dt>Created</dt><dd>{formatInstant(props.todo.createdAt)}</dd></div>
        <div><dt>Moved to trash</dt><dd>{formatInstant(props.todo.trashedAt)}</dd></div>
      </dl>
      <div className="detail-actions">
        <button type="button" className="button primary" disabled={props.pending} onClick={props.onRestore}>{props.pending ? "Restoring..." : "Restore todo"}</button>
        <button type="button" className="button danger-ghost" disabled={props.pending} onClick={props.onErase}>{props.pending ? "Erasing..." : "Erase permanently"}</button>
      </div>
      <TodoHistory history={props.history} error={props.historyError} onRetry={props.onHistoryRetry} />
    </>
  );
}
