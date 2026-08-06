import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "quiet" | "danger" }) {
  const { className = "", tone = "primary", type = "button", ...rest } = props;
  return <button type={type} className={`button button-${tone} ${className}`} {...rest} />;
}

export function Field(props: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const { id, label, error, className = "", ...rest } = props;
  const fieldId = id ?? label.toLowerCase().replaceAll(" ", "-");
  return (
    <label className="field" htmlFor={fieldId}>
      <span>{label}</span>
      <input id={fieldId} className={`input ${error === undefined ? "" : "input-error"} ${className}`} {...rest} />
      {error === undefined ? null : <small className="field-error">{error}</small>}
    </label>
  );
}

export function SelectField(props: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  const { id, label, children, ...rest } = props;
  const fieldId = id ?? label.toLowerCase().replaceAll(" ", "-");
  return (
    <label className="field" htmlFor={fieldId}>
      <span>{label}</span>
      <select id={fieldId} className="input" {...rest}>{children}</select>
    </label>
  );
}

export function Notice(props: { tone?: "info" | "error" | "success"; children: ReactNode }) {
  return <p className={`notice notice-${props.tone ?? "info"}`} role={props.tone === "error" ? "alert" : "status"}>{props.children}</p>;
}

export function Panel(props: { title: string; eyebrow?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`card ${props.className ?? ""}`}>
      {props.eyebrow === undefined ? null : <p className="eyebrow">{props.eyebrow}</p>}
      <h2>{props.title}</h2>
      {props.children}
    </section>
  );
}

export function LoadingState(props: { label?: string }) {
  return <div className="loading" role="status"><span className="spinner" aria-hidden="true" />{props.label ?? "Loading"}</div>;
}

export function EmptyState(props: { title: string; message: string; action?: ReactNode }) {
  return <div className="empty-state"><h3>{props.title}</h3><p>{props.message}</p>{props.action}</div>;
}

export function DiagnosisList(props: { items: Array<{ accessor: string; message: string }> }) {
  if (props.items.length === 0) return null;
  return <ul className="diagnoses">{props.items.map((item, index) => <li key={`${item.accessor}-${index}`}>{item.accessor === "" ? item.message : `${item.accessor}: ${item.message}`}</li>)}</ul>;
}
