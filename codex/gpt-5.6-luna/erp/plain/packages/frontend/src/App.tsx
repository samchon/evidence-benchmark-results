import { AppProviders } from "./components/providers/app-providers";
import { AppFrame } from "./components/app-frame";
import { LoginPage } from "./components/auth/login-page";
import { InvitationPage } from "./components/auth/invitation-page";
import { MembershipSelectionPage } from "./components/auth/membership-selection-page";
import { AccountsPage } from "./components/finance/accounts-page";
import { JournalsPage } from "./components/finance/journals-page";
import { ReportsPage } from "./components/finance/reports-page";
import { ControlsPage } from "./components/controls/controls-page";
import { OperationsPage } from "./components/operations/operations-page";
import { PeoplePage } from "./components/people/people-page";
import { PlanningPage } from "./components/planning/planning-page";
import { SettingsPage } from "./components/settings/settings-page";
import { DashboardPage } from "./components/overview/dashboard-page";
import { Button, PageHeader, Panel } from "./components/ui/primitives";
import { DevGalleryPage } from "./components/dev/gallery-page";
import { useSession } from "./lib/session-hooks";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

export function App() {
  return <AppProviders><Routes><Route path="/login" element={<LoginPage />} /><Route path="/invitation" element={<InvitationPage />} /><Route path="/dev/gallery" element={import.meta.env.DEV ? <DevGalleryPage /> : <NotFoundPage />} /><Route element={<ProtectedLayout />}><Route path="/select-organization" element={<MembershipSelectionPage />} /><Route path="/app" element={<AppFrame />}><Route index element={<DashboardPage />} /><Route path="finance/accounts" element={<AccountsPage />} /><Route path="finance/journals" element={<JournalsPage />} /><Route path="finance/reports" element={<ReportsPage />} /><Route path="operations" element={<OperationsPage />} /><Route path="people" element={<PeoplePage />} /><Route path="controls" element={<ControlsPage />} /><Route path="planning" element={<PlanningPage />} /><Route path="settings" element={<SettingsPage />} /></Route></Route><Route path="/" element={<HomeRedirect />} /><Route path="*" element={<NotFoundPage />} /></Routes></AppProviders>;
}

function ProtectedLayout() {
  const session = useSession();
  const location = useLocation();
  if (session.status === "restoring") return <main className="shell"><p className="muted">Restoring your session...</p></main>;
  if (session.status === "anonymous") return <Navigate replace to="/login" state={{ from: location }} />;
  const selected = session.auth?.memberships.some((membership) => membership.id === session.selectedMembershipId && membership.status === "active") ?? false;
  if (!selected && location.pathname !== "/select-organization") return <Navigate replace to="/select-organization" state={{ from: location }} />;
  return <Outlet />;
}

function HomeRedirect() {
  const session = useSession();
  if (session.status === "restoring") return <main className="shell"><p className="muted">Restoring your session...</p></main>;
  return <Navigate replace to={session.status === "authenticated" ? (session.selectedMembershipId === null ? "/select-organization" : "/app") : "/login"} />;
}

function NotFoundPage() { return <main className="shell"><PageHeader eyebrow="404" title="That page is not in this workspace" description="The route may have moved, or the record may not be visible in the selected organization." action={<Button onPress={() => window.location.assign("/app")}>Return to overview</Button>} /><Panel title="Nothing to show"><p className="panel-copy">Use the navigation to continue with a known workspace capability.</p></Panel></main>; }
