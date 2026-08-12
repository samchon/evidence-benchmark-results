import { useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { AppFrame } from "./components/app-frame";
import { AdminPage } from "./components/admin/admin-page";
import { CatalogPage } from "./components/catalog/catalog-page";
import { CustomerPage } from "./components/customer/customer-page";
import { AuthPage } from "./components/public/auth-page";
import { HomePage } from "./components/public/home-page";
import { SellerPage } from "./components/seller/seller-page";
import { AppProviders } from "./components/providers/app-providers";
import { clearSession, readSession, type ActorKind, type StoredSession } from "./lib/client";
import { useShoppingOperations } from "./lib/shopping/hooks";

/** Owns session restoration, route access, and the application shell. */
export function App() {
  return <AppProviders><Application /></AppProviders>;
}

function Application() {
  const operations = useShoppingOperations();
  const navigate = useNavigate();
  const [session, setSession] = useState<StoredSession | null>(() => readSession());

  const signOut = async () => {
    try {
      if (session?.actor === "customer") await operations.AuthCustomerLogoutCustomerLogout();
      if (session?.actor === "seller") await operations.AuthSellerLogoutSellerLogout();
    } finally {
      clearSession();
      setSession(null);
      void navigate("/", { replace: true });
    }
  };

  return <Routes>
    <Route element={<Shell session={session} onSignOut={() => { void signOut(); }} />}>
      <Route index element={<HomePage />} />
      <Route path="auth" element={<AuthPage onSession={setSession} />} />
      <Route path="catalog" element={<CatalogPage session={session} />} />
      <Route element={<RequireSession session={session} actor="customer" />}>
        <Route path="customer" element={<CustomerPage session={session as StoredSession} onSession={setSession} />} />
      </Route>
      <Route element={<RequireSession session={session} actor="seller" />}>
        <Route path="seller" element={<SellerPage session={session as StoredSession} />} />
      </Route>
      <Route element={<RequireSession session={session} admin />}>
        <Route path="admin" element={<AdminPage session={session as StoredSession} />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>;
}

function Shell(props: { session: StoredSession | null; onSignOut: () => void }) {
  return <AppFrame session={props.session} onSignOut={props.onSignOut}><Outlet /></AppFrame>;
}

function RequireSession(props: { session: StoredSession | null; actor?: ActorKind; admin?: boolean }) {
  const location = useLocation();
  if (props.session === null) return <Navigate to={`/auth?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (props.actor !== undefined && props.session.actor !== props.actor) return <Navigate to="/" replace />;
  if (props.admin && !props.session.identity.grades.some((grade) => grade.toLowerCase().includes("administrator"))) return <Navigate to="/" replace />;
  return <Outlet />;
}
