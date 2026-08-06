const states = [
  { name: "Loading", className: "loading-state", content: "Loading vendors" },
  { name: "Initial empty", className: "empty-state", content: "No records yet. Connect an organization to begin." },
  { name: "Filtered empty", className: "empty-state", content: "No matches for the active filter." },
  { name: "Expected refusal", className: "error-state", content: "You need an Owner role to perform this action." },
  { name: "Unexpected error", className: "error-state", content: "We could not load this view. Try again." },
  { name: "Successful mutation", className: "notice", content: "Vendor created. The list is refreshed." },
] as const;

/** Development-only state gallery used to inspect every shared screen state. */
export function GalleryPage() {
  if (!import.meta.env.DEV) return null;
  return (
    <main className="content page-stack">
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">Development gallery</p>
          <h1>Screen states</h1>
          <p className="lede">Deterministic fixtures for loading, empty, refusal, retry, and success states.</p>
        </div>
      </div>
      <div className="profile-grid">
        {states.map((state) => (
          <section className="card" key={state.name} aria-label={state.name}>
            <div className="card-header"><h2>{state.name}</h2></div>
            <div className={state.className} role={state.className === "error-state" ? "alert" : "status"}>{state.content}</div>
          </section>
        ))}
      </div>
    </main>
  );
}
