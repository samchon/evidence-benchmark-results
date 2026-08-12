import { Link, Route, Routes } from "react-router-dom";

import { AuthPage } from "./components/auth/auth-page";
import { AppShell } from "./components/common/app-shell";
import { GalleryPage } from "./components/dev/gallery-page";
import { SettingsPage } from "./components/settings/settings-page";
import { TodoPage } from "./components/todo/todo-page";
import { TrashPage } from "./components/trash/trash-page";

export function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      {import.meta.env.DEV ? <Route path="/dev/gallery" element={<GalleryPage />} /> : null}
      <Route element={<AppShell />}>
        <Route path="/app" element={<TodoPage />} />
        <Route path="/trash" element={<TrashPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function NotFoundPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Page not found</p>
        <h1>That page has moved.</h1>
        <p className="muted">The requested route does not exist in this private workspace.</p>
        <Link className="button primary" to="/app">Back to active todos</Link>
      </section>
    </main>
  );
}
