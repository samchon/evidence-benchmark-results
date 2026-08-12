import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type { ITodo, ITodoHistory } from "@benchmark/todo-api";

import { PageHeader } from "@/components/common/app-shell";
import { TodoHistory } from "@/components/todo/todo-history";
import {
  formatError,
  useCompleteTodo,
  useCreateTodo,
  useIncompleteTodo,
  useTodoDetail,
  useTodoHistory,
  useTodoList,
  useTrashTodo,
  useUpdateTodo,
  validationMessage,
} from "@/lib/api-hooks";
import { formatCalendarDate, formatInstant, readUuid } from "@/lib/utils";

const completionValues = ["all", "complete-only", "incomplete-only"] as const;
const sortValues = ["created-desc", "created-asc", "start-asc", "start-desc", "due-asc", "due-desc"] as const;
type Completion = (typeof completionValues)[number];
type Sort = (typeof sortValues)[number];

function readChoice<T extends string>(value: string | null, values: readonly T[], fallback: T): T {
  return value !== null && values.includes(value as T) ? (value as T) : fallback;
}

function readPage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

export function TodoPage() {
  const [params, setParams] = useSearchParams();
  const selectedId = readUuid(params.get("todo"));
  const completion = readChoice(params.get("completion"), completionValues, "all");
  const sort = readChoice(params.get("sort"), sortValues, "created-desc");
  const page = readPage(params.get("page"));
  const [showCreate, setShowCreate] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);
  const list = useTodoList({ completion, sort, page, limit: 8 });
  const detail = useTodoDetail(selectedId);
  const history = useTodoHistory(selectedId);
  const create = useCreateTodo();
  const update = useUpdateTodo();
  const complete = useCompleteTodo();
  const incomplete = useIncompleteTodo();
  const trash = useTrashTodo();
  const records = list.data?.data ?? [];
  const pagination = list.data?.pagination;
  const hasListSelection = params.has("completion") || params.has("sort") || params.has("page");
  const showInitialEmpty = selectedId === null && records.length === 0 && pagination?.records === 0 && hasListSelection === false;

  const setSelected = (id: string | null) => {
    setParams((current) => {
      if (id === null) current.delete("todo");
      else current.set("todo", id);
      return current;
    });
  };
  const setListParam = (key: "completion" | "sort" | "page", value: string | number) => {
    setParams((current) => {
      if (key === "page" && value === 1) current.delete("page");
      else current.set(key, String(value));
      if (key === "completion" || key === "sort") current.delete("page");
      return current;
    });
  };
  const run = async (action: () => Promise<unknown>, success: string): Promise<boolean> => {
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
      <PageHeader eyebrow="Today, made tangible" title="Active todos" description="A focused view of the work still in motion." action={<button type="button" className="button primary" onClick={() => setShowCreate(true)}>New todo</button>} />
      {actionError && <p className="inline-error" role="alert">{actionError}</p>}
      <section className="toolbar card">
        <div className="toolbar-title"><strong>{pagination?.records ?? 0}</strong><span>active items</span></div>
        <label className="select-field" htmlFor="completion-filter"><span>Show</span><select id="completion-filter" aria-label="Completion filter" value={completion} onChange={(event) => setListParam("completion", event.target.value)}><option value="all">All states</option><option value="incomplete-only">In progress</option><option value="complete-only">Completed</option></select></label>
        <label className="select-field" htmlFor="todo-sort"><span>Sort</span><select id="todo-sort" aria-label="Todo sort" value={sort} onChange={(event) => setListParam("sort", event.target.value)}><option value="created-desc">Newest first</option><option value="created-asc">Oldest first</option><option value="start-asc">Start date: earliest</option><option value="start-desc">Start date: latest</option><option value="due-asc">Due date: earliest</option><option value="due-desc">Due date: latest</option></select></label>
      </section>
      {list.isPending && <div className="state-card card"><span className="spinner" /><p>Loading your active work...</p></div>}
      {list.isError && <div className="state-card card error-state"><p>We could not load your todos.</p><button type="button" className="button secondary" onClick={() => void list.refetch()}>Try again</button></div>}
      {!list.isPending && !list.isError && showInitialEmpty && <EmptyTodos onCreate={() => setShowCreate(true)} />}
      {(records.length > 0 || selectedId !== null || (pagination !== undefined && showInitialEmpty === false)) && (
        <div className="todo-layout">
          <div className="todo-list" aria-label="Active todos">
            {records.map((todo) => <TodoRow key={todo.id} todo={todo} selected={selectedId === todo.id} pending={actionPending} onSelect={() => setSelected(todo.id)} onToggle={() => void run(() => todo.completion === "complete" ? incomplete.mutateAsync(todo.id) : complete.mutateAsync(todo.id), todo.completion === "complete" ? "Marked in progress" : "Marked complete")} />)}
            {records.length === 0 && !list.isError && <p className="muted">This filter has no matching active todos.</p>}
            {pagination && <div className="pagination"><span>Page {pagination.current} of {Math.max(1, pagination.pages)}</span><div><button type="button" className="button small secondary" disabled={page <= 1} onClick={() => setListParam("page", page - 1)}>Previous</button><button type="button" className="button small secondary" disabled={page >= pagination.pages} onClick={() => setListParam("page", page + 1)}>Next</button></div></div>}
          </div>
          {selectedId && <TodoDetail todo={detail.data} history={history.data} loading={detail.isPending} error={detail.isError} historyError={history.isError} pending={actionPending} onRetry={() => void detail.refetch()} onHistoryRetry={() => void history.refetch()} onClose={() => setSelected(null)} onToggle={() => detail.data && void run(() => detail.data.completion === "complete" ? incomplete.mutateAsync(detail.data.id) : complete.mutateAsync(detail.data.id), detail.data.completion === "complete" ? "Marked in progress" : "Marked complete")} onTrash={() => { if (detail.data) void run(() => trash.mutateAsync(detail.data.id), "Moved to trash").then((success) => { if (success) setSelected(null); }); }} onSave={async (body) => detail.data ? run(() => update.mutateAsync({ id: detail.data.id, body }), "Todo updated") : false} />}
        </div>
      )}
      {showCreate && <CreateDialog pending={create.isPending || actionPending} onClose={() => setShowCreate(false)} onSave={(body) => void run(() => create.mutateAsync(body).then(() => setShowCreate(false)), "Todo created")} />}
    </div>
  );
}

function EmptyTodos(props: { onCreate: () => void }) {
  return <div className="empty-card card"><div className="empty-icon">+</div><h2>A clear stretch ahead</h2><p>Nothing is active right now. Capture the next useful thing before it slips away.</p><button type="button" className="button secondary" onClick={props.onCreate}>Create your first todo</button></div>;
}

function TodoRow(props: { todo: ITodo.ISummary; selected: boolean; pending: boolean; onSelect: () => void; onToggle: () => void }) {
  const start = props.todo.startDate === null ? "No start date" : `Start ${formatCalendarDate(props.todo.startDate)}`;
  const due = props.todo.dueDate === null ? "No due date" : `Due ${formatCalendarDate(props.todo.dueDate)}`;
  return <article className={props.selected ? "todo-row selected" : "todo-row"}><button type="button" className={props.todo.completion === "complete" ? "check complete" : "check"} aria-label={props.todo.completion === "complete" ? `Mark ${props.todo.title} incomplete` : `Mark ${props.todo.title} complete`} disabled={props.pending} onClick={props.onToggle}>{props.todo.completion === "complete" ? "✓" : ""}</button><button type="button" className="todo-row-main" onClick={props.onSelect}><strong className={props.todo.completion === "complete" ? "done" : ""}>{props.todo.title}</strong><span>{start} · {due} · {props.todo.completion === "complete" ? "Complete" : "In progress"}</span><span>Created {formatInstant(props.todo.createdAt)}</span></button><span className="chevron" aria-hidden="true">›</span></article>;
}

function TodoDetail(props: { todo: ITodo | undefined; history: ITodoHistory[] | undefined; loading: boolean; error: boolean; historyError: boolean; pending: boolean; onRetry: () => void; onHistoryRetry: () => void; onClose: () => void; onToggle: () => void; onTrash: () => void; onSave: (body: ITodo.IUpdate) => Promise<boolean> }) {
  const [editing, setEditing] = useState(false);
  if (props.loading) return <aside className="detail-panel card"><span className="spinner" />Loading detail...</aside>;
  if (props.error || props.todo === undefined) return <aside className="detail-panel card error-state"><p>We could not load this todo.</p><button type="button" className="button secondary" onClick={props.onRetry}>Try again</button></aside>;
  const todo = props.todo;
  return <aside className="detail-panel card"><div className="detail-head"><div><p className="eyebrow">Todo detail</p><h2>{todo.title}</h2></div><button type="button" className="icon-button" aria-label="Close detail" onClick={props.onClose}>×</button></div>{editing ? <EditForm todo={todo} pending={props.pending} onCancel={() => setEditing(false)} onSave={async (body) => { if (await props.onSave(body)) setEditing(false); }} /> : <><div className="detail-status"><span className={todo.completion === "complete" ? "pill success" : "pill warm"}>{todo.completion === "complete" ? "Complete" : "In progress"}</span><span className="version">Version {todo.version}</span></div><p className="detail-description">{todo.description ?? "No description yet."}</p><dl className="detail-meta"><div><dt>Start</dt><dd>{formatCalendarDate(todo.startDate)}</dd></div><div><dt>Due</dt><dd>{formatCalendarDate(todo.dueDate)}</dd></div><div><dt>Created</dt><dd>{formatInstant(todo.createdAt)}</dd></div></dl><div className="detail-actions"><button type="button" className="button secondary" disabled={props.pending} onClick={props.onToggle}>{todo.completion === "complete" ? "Mark in progress" : "Mark complete"}</button><button type="button" className="button secondary" disabled={props.pending} onClick={() => setEditing(true)}>Edit content</button><button type="button" className="button danger-ghost" disabled={props.pending} onClick={props.onTrash}>Move to trash</button></div><TodoHistory history={props.history} error={props.historyError} onRetry={props.onHistoryRetry} /></>}</aside>;
}

function CreateDialog(props: { pending: boolean; onClose: () => void; onSave: (body: ITodo.ICreate) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const body = { title: title.trim(), description: description === "" ? null : description, startDate: startDate || null, dueDate: dueDate || null };
    const message = validationMessage(body);
    if (message !== null) setFormError(message);
    else props.onSave(body);
  };
  return <Dialog title="Capture a todo" onClose={props.onClose}><form className="form-stack" onSubmit={submit}><Field label="Title" value={title} onChange={setTitle} /><Field label="Description" value={description} onChange={setDescription} multiline />{formError && <p className="inline-error" role="alert">{formError}</p>}<DateFields startDate={startDate} dueDate={dueDate} setStartDate={setStartDate} setDueDate={setDueDate} /><div className="dialog-actions"><button type="button" className="button secondary" onClick={props.onClose}>Cancel</button><button type="submit" className="button primary" disabled={props.pending}>{props.pending ? "Saving..." : "Create todo"}</button></div></form></Dialog>;
}

function EditForm(props: { todo: ITodo; pending?: boolean; onCancel: () => void; onSave: (body: ITodo.IUpdate) => Promise<void> }) {
  const [title, setTitle] = useState(props.todo.title);
  const [description, setDescription] = useState(props.todo.description ?? "");
  const [startDate, setStartDate] = useState(props.todo.startDate ?? "");
  const [dueDate, setDueDate] = useState(props.todo.dueDate ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const body = { title: title.trim(), description: description === "" ? null : description, startDate: startDate || null, dueDate: dueDate || null, version: props.todo.version };
    const message = validationMessage(body);
    if (message !== null) {
      setFormError(message);
      return;
    }
    if (body.title === props.todo.title && body.description === props.todo.description && body.startDate === props.todo.startDate && body.dueDate === props.todo.dueDate) {
      setFormError("Change at least one content field before saving.");
      return;
    }
    await props.onSave(body);
  };
  return <form className="form-stack compact-form" onSubmit={(event) => void submit(event)}><Field label="Title" value={title} onChange={setTitle} /><Field label="Description" value={description} onChange={setDescription} multiline />{formError && <p className="inline-error" role="alert">{formError}</p>}<DateFields startDate={startDate} dueDate={dueDate} setStartDate={setStartDate} setDueDate={setDueDate} /><div className="dialog-actions"><button type="button" className="button secondary" disabled={props.pending} onClick={props.onCancel}>Cancel</button><button type="submit" className="button primary" disabled={props.pending}>{props.pending ? "Saving..." : "Save changes"}</button></div></form>;
}

function DateFields(props: { startDate: string; dueDate: string; setStartDate: (value: string) => void; setDueDate: (value: string) => void }) {
  return <div className="date-grid"><Field label="Start date" value={props.startDate} onChange={props.setStartDate} type="date" /><Field label="Due date" value={props.dueDate} onChange={props.setDueDate} type="date" /></div>;
}

function Field(props: { label: string; value: string; onChange: (value: string) => void; type?: string; multiline?: boolean }) {
  const id = props.label.toLowerCase().replaceAll(" ", "-");
  const control = props.multiline
    ? <textarea id={id} aria-label="Description" value={props.value} onChange={(event) => props.onChange(event.target.value)} rows={3} />
    : props.label === "Title"
      ? <input id={id} aria-label="Title" required type={props.type ?? "text"} value={props.value} onChange={(event) => props.onChange(event.target.value)} />
      : props.label === "Start date"
        ? <input id={id} aria-label="Start date" type={props.type ?? "text"} value={props.value} onChange={(event) => props.onChange(event.target.value)} />
        : <input id={id} aria-label="Due date" type={props.type ?? "text"} value={props.value} onChange={(event) => props.onChange(event.target.value)} />;
  return <label className="field" htmlFor={id}><span id={`${id}-label`}>{props.label}</span>{control}</label>;
}

function Dialog(props: { title: string; onClose: () => void; children: React.ReactNode }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeButton.current?.focus(); }, [closeButton]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") props.onClose(); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [props.onClose]);
  return <div className="dialog-backdrop" role="presentation"><section className="dialog card" role="dialog" aria-label={props.title}><div className="detail-head"><div><p className="eyebrow">New entry</p><h2>{props.title}</h2></div><button ref={closeButton} type="button" className="icon-button" aria-label="Close dialog" onClick={props.onClose}>×</button></div>{props.children}</section></div>;
}
