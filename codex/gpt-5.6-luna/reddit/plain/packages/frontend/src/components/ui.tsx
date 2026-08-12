import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { Link } from "react-router-dom";

import { errorMessage } from "@/lib/hooks";
import { relativeTime } from "@/lib/utils";

export function Button(props: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  children: ReactNode;
  variant?: "primary" | "quiet" | "danger";
  action?: () => void;
}): ReactElement {
  return (
    <button
      className={`button button-${props.variant ?? "primary"}`}
      type={props.type ?? "button"}
      onClick={props.action}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

export function Field(props: {
  label: string;
  id?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const id = props.id ?? props.label.toLowerCase().replaceAll(
    /[^a-z0-9]+/g,
    "-",
  );
  return (
    <label className="field" htmlFor={id}>
      <span id={`${id}-label`}>{props.label}</span>
      {props.multiline === true ? (
        <textarea
          id={id}
          aria-label="Field"
          aria-labelledby={`${id}-label`}
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          placeholder={props.placeholder}
          required={props.required}
          autoComplete={props.autoComplete}
          rows={4}
        />
      ) : (
        <input
          id={id}
          aria-label="Field"
          aria-labelledby={`${id}-label`}
          type={props.type ?? "text"}
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          placeholder={props.placeholder}
          required={props.required}
          autoComplete={props.autoComplete}
        />
      )}
    </label>
  );
}

export function PageState(props: {
  title: string;
  message?: string;
  error?: unknown;
  onRetry?: () => void;
}) {
  return (
    <div className="state" role={props.error === undefined ? "status" : "alert"}>
      <h2>{props.title}</h2>
      <p>{props.error === undefined ? props.message : errorMessage(props.error)}</p>
      {props.onRetry !== undefined ? <Button action={props.onRetry}>Try again</Button> : null}
    </div>
  );
}

export function Card(props: { children: ReactNode; className?: string }) {
  return <section className={`card ${props.className ?? ""}`}>{props.children}</section>;
}

export function Pagination(props: {
  current: number;
  hasNext: boolean;
  reset?: boolean;
  onChange: (page: number) => void;
}) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <Button variant="quiet" disabled={props.current <= 1} action={() => props.onChange(props.current - 1)}>
        Previous
      </Button>
      <span>Page {props.current}</span>
      <Button variant="quiet" disabled={!props.hasNext} action={() => props.onChange(props.current + 1)}>
        Next
      </Button>
      {props.reset === true ? <span role="status">Results restarted from the beginning.</span> : null}
    </nav>
  );
}

export function PostCard(props: {
  post: { id: string; title: string; type?: "text" | "link" | "image"; preview: string; author: string; community: string; score: number; commentCount: number; createdAt: string };
}) {
  return (
    <article className="post-card">
      <div className="post-score" aria-label={`Score ${props.post.score}`}>
        <span aria-hidden="true">Up</span>
        <strong>{props.post.score}</strong>
        <span aria-hidden="true">Down</span>
      </div>
      <div>
        <h3><Link to={`/post/${props.post.id}`}>{props.post.title}</Link></h3>
        {props.post.type === "image" ? (
          <img
            className="post-thumbnail"
            src={props.post.preview}
            alt={`Thumbnail for ${props.post.title}`}
          />
        ) : <p className="muted">{props.post.preview}</p>}
        <p className="meta">
          by <Link to={`/u/${encodeURIComponent(props.post.author)}`}>{props.post.author}</Link>  |  r/{props.post.community}  |  {relativeTime(props.post.createdAt)}  |  {props.post.commentCount} comments
        </p>
      </div>
    </article>
  );
}
