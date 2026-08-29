import { Route } from "react-router-dom";
import TailorHomePage from "./pages/TailorHomePage";
import TailorDashboardPage from "./pages/TailorDashboardPage";
import TailorRequestsPage from "./pages/TailorRequestsPage";
import TailorRequestDetailPage from "./pages/TailorRequestDetailPage";
import TailorOrdersPage from "./pages/TailorOrdersPage";
import TailorOrderDetailPage from "./pages/TailorOrderDetailPage";
import TailorProfilePage from "./pages/TailorProfilePage";

export const tailorRoutes = (
  <>
    <Route path="/tailor" element={<TailorHomePage />} />
    <Route path="/tailor/dashboard" element={<TailorDashboardPage />} />
    <Route path="/tailor/requests" element={<TailorRequestsPage />} />
    <Route path="/tailor/requests/:id" element={<TailorRequestDetailPage />} />
    <Route path="/tailor/orders" element={<TailorOrdersPage />} />
    <Route path="/tailor/orders/:id" element={<TailorOrderDetailPage />} />
    <Route path="/tailor/profile" element={<TailorProfilePage />} />
  </>
);
