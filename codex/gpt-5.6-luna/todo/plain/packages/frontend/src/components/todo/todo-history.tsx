import type { ITodoHistory } from "@benchmark/todo-api";
import { formatInstant } from "@/lib/utils";

function changedValues(entry: ITodoHistory): string[] {
  const values: string[] = [];
  if (entry.title !== undefined) values.push(`Title: ${entry.title}`);
  if (entry.description !== undefined) values.push(`Description: ${entry.description ?? "Cleared"}`);
  if (entry.startDate !== undefined) values.push(`Start date: ${entry.startDate ?? "Cleared"}`);
  if (entry.dueDate !== undefined) values.push(`Due date: ${entry.dueDate ?? "Cleared"}`);
  return values;
}

export function TodoHistory(props: {
  history: ITodoHistory[] | undefined;
  error: boolean;
  onRetry: () => void;
}) {
  return (
    <section className="history" aria-label="Edit history">
      <div className="section-label"><span>Edit history</span><small>{props.history?.length ?? 0} entries</small></div>
      {props.error ? (
        <div className="inline-error"><p>We couldn’t load the edit history.</p><button type="button" className="text-button" onClick={props.onRetry}>Try again</button></div>
      ) : props.history === undefined ? (
        <p className="muted">Loading history…</p>
      ) : props.history.length === 0 ? (
        <p className="muted">No content edits yet.</p>
      ) : (
        <ol>
          {props.history.map((entry) => (
            <li key={entry.id}>
              <span className="history-dot" />
              <div>
                <strong>{formatInstant(entry.createdAt)}</strong>
                <span>{changedValues(entry).join(" · ")}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
