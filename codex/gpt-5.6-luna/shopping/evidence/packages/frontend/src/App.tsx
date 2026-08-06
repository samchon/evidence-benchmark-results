import { Navigate, Route, Routes } from "react-router-dom";

import { AppProviders } from "./components/providers/app-providers";
import { AdminPage } from "./components/admin/admin-page";
import { CustomerPage } from "./components/customer/customer-page";
import { HomePage } from "./components/home/home-page";
import { OperationsPage } from "./components/operations/operations-page";
import { SellerPage } from "./components/seller/seller-page";

/** Renders the benchmark workspace entry screen. */
export function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/operations" element={<OperationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProviders>
  );
}
