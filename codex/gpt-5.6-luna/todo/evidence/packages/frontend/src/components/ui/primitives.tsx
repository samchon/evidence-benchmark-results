import type { ReactNode } from "react";

export function InlineAlert(props: { tone?: "error" | "info" | "success"; children: ReactNode }) {
  return <p className={`alert alert-${props.tone ?? "info"}`} role={props.tone === "error" ? "alert" : "status"}>{props.children}</p>;
}

export function LoadingBlock(props: { label?: string }) {
  return <div className="loading-block" role="status" aria-live="polite"><span className="spinner" aria-hidden="true" />{props.label ?? "Loading"}</div>;
}

export function ErrorBlock(props: { message: string; onRetry?: () => void }) {
  return <div className="error-block" role="alert"><strong>Could not load this view</strong><p>{props.message}</p>{props.onRetry !== undefined && <button type="button" className="button button-secondary" onClick={props.onRetry}>Try again</button>}</div>;
}

export function EmptyBlock(props: { title: string; children: ReactNode }) {
  return <div className="empty-block"><span className="empty-mark" aria-hidden="true">+</span><h3>{props.title}</h3><p>{props.children}</p></div>;
}

export function SectionHeading(props: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="section-heading"><div><p className="eyebrow">{props.eyebrow}</p><h1>{props.title}</h1>{props.description !== undefined && <p className="lede">{props.description}</p>}</div>{props.action}</div>;
}

export function Modal(props: { title: string; onClose: () => void; children: ReactNode }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) props.onClose(); }}><section className="modal" role="dialog" aria-labelledby="modal-title"><div className="modal-head"><h2 id="modal-title">{props.title}</h2><button type="button" className="icon-button" aria-label="Close dialog" onClick={props.onClose}>Close</button></div>{props.children}</section></div>;
}
