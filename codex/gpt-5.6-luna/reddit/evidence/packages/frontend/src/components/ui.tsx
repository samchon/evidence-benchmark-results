import { cloneElement, type ReactElement, type ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: ReactNode; action?: ReactNode }) {
  return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="lede">{description}</p>}</div>{action && <div className="header-action">{action}</div>}</div>;
}

export function LoadingState({ label = "Loading" }: { label?: string }) { return <div className="state-card" role="status"><span className="spinner" />{label}…</div>; }
export function ErrorState({ error, retry }: { error: unknown; retry: () => void }) { return <div className="state-card error-state" role="alert"><strong>We couldn’t load this yet.</strong><span>{error instanceof Error ? error.message : "The service returned an unexpected response."}</span><button type="button" className="button" onClick={retry}>Try again</button></div>; }
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) { return <div className="state-card empty-state"><strong>{title}</strong>{children && <span>{children}</span>}</div>; }
export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "success" | "danger" }) { return <div className={`notice notice-${tone}`} role={tone === "danger" ? "alert" : "status"}>{children}</div>; }
export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) { const control = children as ReactElement<{ "aria-label"?: string }>; return <div className="field"><span>{label}</span>{cloneElement(control, { "aria-label": label })}{error && <small className="field-error">{error}</small>}</div>; }
export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) { return <div className="pagination" aria-label="Pagination"><button type="button" className="button button-quiet" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button><span>Page {page} of {Math.max(1, pages)}</span><button type="button" className="button button-quiet" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</button></div>; }
