import { AppProviders } from "./components/providers/app-providers";
import { AppFrame } from "./components/app-frame";
import { DashboardPage } from "./components/dashboard-page";
import { LoginPage } from "./components/login-page";
import { ModulePage } from "./components/module-page";
import { ProfilePage } from "./components/profile-page";
import { RecoveryPage } from "./components/recovery-page";
import { InvitationPage } from "./components/invitation-page";
import { OperationCatalogPage } from "./components/operation-catalog-page";
import { GalleryPage } from "./components/dev/gallery-page";
import { Navigate, Route, Routes } from "react-router-dom";

/** Renders the benchmark workspace entry screen. */
export function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recover" element={<RecoveryPage />} />
        <Route path="/invite" element={<InvitationPage />} />
        <Route path="/__dev/gallery" element={import.meta.env.DEV ? <GalleryPage /> : <Navigate replace to="/" />} />
        <Route element={<AppFrame />}>
          <Route index element={<DashboardPage />} />
          <Route path="modules/:module" element={<ModulePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="operations" element={<OperationCatalogPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>
      </Routes>
    </AppProviders>
  );
}
