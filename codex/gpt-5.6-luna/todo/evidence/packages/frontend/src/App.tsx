import { Link, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import { AppProviders } from "./components/providers/app-providers";
import { AppFrame } from "./components/app-frame";
import { AuthPage } from "./components/auth/auth-page";
import { DashboardPage } from "./components/todo/dashboard-page";
import { TrashPage } from "./components/trash/trash-page";
import { SecurityPage } from "./components/security/security-page";
import { useSession } from "@/lib/auth/session";
import { LoadingState } from "@/components/ui/ui";

function ProtectedLayout() {
  const session = useSession();
  const location = useLocation();
  if (session.status === "restoring") return <LoadingState label="Restoring your workspace" />;
  if (session.status === "anonymous") return <Navigate replace to={`/auth?from=${encodeURIComponent(location.pathname)}`} />;
  return <Outlet />;
}

function LandingRedirect() {
  const session = useSession();
  if (session.status === "restoring") return <LoadingState label="Restoring your workspace" />;
  return <Navigate replace to={session.status === "authenticated" ? "/app" : "/auth"} />;
}

function NotFoundPage() {
  return <main className="shell"><section className="card"><p className="eyebrow">Not found</p><h1>That page is not here.</h1><p className="lede">Return to the workspace and continue from the current account boundary.</p><Link className="button button-primary button-link" to="/">Return home</Link></section></main>;
}

/** Routes the complete requirement-backed Todo workspace. */
export function App() {
  return (
    <AppProviders>
      <Routes>
        <Route element={<AppFrame />}>
          <Route path="/" element={<LandingRedirect />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/trash" element={<TrashPage />} />
            <Route path="/security" element={<SecurityPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AppProviders>
  );
}
