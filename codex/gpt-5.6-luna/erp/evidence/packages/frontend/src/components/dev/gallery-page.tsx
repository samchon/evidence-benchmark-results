import { useState } from "react";

/** Development-only state gallery for the workbench review. */
export function GalleryPage() {
  const [state, setState] = useState<"loading" | "empty" | "error" | "success">("success");
  if (import.meta.env.DEV === false) return null;
  return (
    <main className="app-shell" aria-label="Development state gallery">
      <section className="panel command">
        <p className="eyebrow">Development gallery</p>
        <h1>Workbench state review</h1>
        <label htmlFor="gallery-state">State</label>
        <select id="gallery-state" value={state} onChange={(event) => setState(event.target.value as typeof state)}>
          <option value="loading">Loading</option>
          <option value="empty">Empty</option>
          <option value="error">Error and retry</option>
          <option value="success">Success</option>
        </select>
        <p role="status" aria-live="polite">
          {state === "loading" ? "Loading command metadata..." : state === "empty" ? "No operations match this filter." : state === "error" ? "The command service refused the request." : "Command response received."}
        </p>
      </section>
    </main>
  );
}
