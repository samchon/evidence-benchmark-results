/* The shared lint sees capitalized design-system wrappers as static JSX. The
 * rendered element remains a native, typed button/input control. */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "quiet" | "danger" }) {
  const { className = "", tone = "primary", ...rest } = props;
  return <button type="button" className={`button button-${tone} ${className}`} {...rest} />;
}

export function Field(props: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  const { label, hint, id, ...rest } = props;
  const fieldId = id ?? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return <label className="field" htmlFor={fieldId}>
    <span>{label}</span>
    <input id={fieldId} {...rest} />
    {hint === undefined ? null : <small>{hint}</small>}
  </label>;
}

export function SelectField(props: { label: string; value: string; onChange: (value: string) => void; options: { label: string; value: string }[] }) {
  const id = `select-${props.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return <label className="field" htmlFor={id}>
    <span>{props.label}</span>
    <select id={id} value={props.value} onChange={(event) => props.onChange(event.target.value)}>
      {props.options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
    </select>
  </label>;
}

export function Card(props: { children: ReactNode; className?: string }) {
  return <section className={`card ${props.className ?? ""}`}>{props.children}</section>;
}

export function EmptyState(props: { title: string; detail: string; action?: ReactNode }) {
  return <Card className="empty-state"><h2>{props.title}</h2><p>{props.detail}</p>{props.action}</Card>;
}

export function ErrorState(props: { error: unknown; onRetry?: () => void }) {
  return <Card className="error-state"><h2>We could not load this view</h2><p>{props.error instanceof Error ? props.error.message : "Please try again."}</p>{props.onRetry === undefined ? null : <Button onClick={props.onRetry}>Try again</Button>}</Card>;
}

export function LoadingState(props: { label?: string }) {
  return <Card className="loading-state" aria-live="polite"><span className="spinner" aria-hidden="true" />{props.label ?? "Loading"}</Card>;
}

export function PageHeader(props: { eyebrow: string; title: string; detail: string; action?: ReactNode }) {
  return <header className="page-header"><div><p className="eyebrow">{props.eyebrow}</p><h1>{props.title}</h1><p className="lede">{props.detail}</p></div>{props.action}</header>;
}

export function StatusPill(props: { value: string; tone?: "good" | "warn" | "bad" | "neutral" }) {
  return <span className={`status-pill status-${props.tone ?? "neutral"}`}>{props.value}</span>;
}

export function Stat(props: { label: string; value: string | number; detail?: string }) {
  return <div className="stat"><span>{props.label}</span><strong>{props.value}</strong>{props.detail === undefined ? null : <small>{props.detail}</small>}</div>;
}
