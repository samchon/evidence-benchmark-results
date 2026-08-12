import type { ReactNode } from "react";

function StateCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="card gallery-card">
      <div className="section-label">
        <span>{title}</span>
        <small>fixture</small>
      </div>
      {children}
    </section>
  );
}

export function GalleryPage() {
  return (
    <main className="content-wrap gallery-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Development only</p>
          <h1>State gallery</h1>
          <p className="page-intro">
            Deterministic fixtures for reviewing screen states without changing
            live workspace data.
          </p>
        </div>
      </header>

      <div className="gallery-grid">
        <StateCard title="Loading">
          <div className="gallery-placeholder" aria-busy="true">
            Loading todos...
          </div>
        </StateCard>

        <StateCard title="Initial empty">
          <div className="empty-card gallery-empty">
            <div className="empty-icon" aria-hidden="true">+</div>
            <h2>No todos yet</h2>
            <p>Create a first todo to give this workspace a clear next step.</p>
            <button className="button primary" type="button">New todo</button>
          </div>
        </StateCard>

        <StateCard title="Filtered empty">
          <div className="gallery-placeholder">
            No completed todos match this view.
          </div>
        </StateCard>

        <StateCard title="Expected refusal">
          <p className="inline-error" role="alert">
            Due date must be on or after the start date.
          </p>
        </StateCard>

        <StateCard title="Unexpected error">
          <div className="gallery-error" role="alert">
            <p>We could not load this list.</p>
            <button className="button secondary" type="button">Retry</button>
          </div>
        </StateCard>

        <StateCard title="Successful post-mutation">
          <div className="gallery-success" role="status">
            <strong>Todo updated</strong>
            <span>Journey launch brief revised</span>
          </div>
        </StateCard>

        <StateCard title="Long and boundary values">
          <article className="gallery-long-value">
            <strong>
              A deliberately long todo title that wraps at narrow widths while
              preserving the complete value for keyboard and screen-reader users
            </strong>
            <p>
              Boundary dates: Jan 01, 2026 - Dec 31, 2026. This fixture also
              checks long descriptions and action labels.
            </p>
          </article>
        </StateCard>
      </div>
    </main>
  );
}
