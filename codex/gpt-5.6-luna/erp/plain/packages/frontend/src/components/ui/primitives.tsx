import { cloneElement, isValidElement, useId, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from "react";

export function Button(props: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & { children: ReactNode; tone?: "primary" | "quiet" | "danger"; onPress?: () => void }) {
  const { tone, onPress, type, ...rest } = props;
  return <button {...rest} type={type ?? "button"} onClick={onPress} className={`button button-${tone ?? "primary"} ${props.className ?? ""}`} />;
}

export function Field(props: { label: string; hint?: string; children: ReactNode }) {
  const controlId = `field-${useId().replace(/:/g, "")}`;
  const control = isValidElement(props.children) ? cloneElement(props.children as ReactElement<{ id?: string }>, { id: controlId }) : props.children;
  return <div className="field"><label htmlFor={controlId}>{props.label}</label>{control}{props.hint === undefined ? null : <small>{props.hint}</small>}</div>;
}

export function Panel(props: { title: string; eyebrow?: string; children: ReactNode; action?: ReactNode }) {
  return <section className="card"><div className="card-heading">{props.eyebrow === undefined ? null : <p className="eyebrow">{props.eyebrow}</p>}<div className="card-title-row"><h2>{props.title}</h2>{props.action}</div></div>{props.children}</section>;
}

export function PageHeader(props: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <header className="page-header"><div><p className="eyebrow">{props.eyebrow}</p><h1>{props.title}</h1><p className="lede">{props.description}</p></div>{props.action}</header>;
}

export function LoadingState() { return <div className="state state-loading" role="status">Loading current workspace data...</div>; }
export function ErrorState(props: { message: string; retry?: () => void }) { return <div className="state state-error" role="alert"><strong>We could not load this view.</strong><span>{props.message}</span>{props.retry === undefined ? null : <Button tone="quiet" onPress={() => { props.retry?.(); }}>Try again</Button>}</div>; }
export function EmptyState(props: { title: string; message: string }) { return <div className="state state-empty"><strong>{props.title}</strong><span>{props.message}</span></div>; }
export function Metric(props: { label: string; value: string; detail?: string }) { return <div className="metric"><span>{props.label}</span><strong>{props.value}</strong>{props.detail === undefined ? null : <small>{props.detail}</small>}</div>; }
