import { Route } from "react-router-dom";
import TailorHomePage from "./pages/TailorHomePage";
import TailorDashboardPage from "./pages/TailorDashboardPage";
import TailorRequestsPage from "./pages/TailorRequestsPage";
import TailorRequestDetailPage from "./pages/TailorRequestDetailPage";
import TailorOrdersPage from "./pages/TailorOrdersPage";
import TailorOrderDetailPage from "./pages/TailorOrderDetailPage";
import TailorProfilePage from "./pages/TailorProfilePage";
import ProtectedRoute from "../auth/ProtectedRoute";

function studio(element) {
  return <ProtectedRoute role="tailor">{element}</ProtectedRoute>;
}

export const tailorRoutes = (
  <>
    <Route path="/tailor" element={studio(<TailorHomePage />)} />
    <Route path="/tailor/dashboard" element={studio(<TailorDashboardPage />)} />
    <Route path="/tailor/requests" element={studio(<TailorRequestsPage />)} />
    <Route path="/tailor/requests/:id" element={studio(<TailorRequestDetailPage />)} />
    <Route path="/tailor/orders" element={studio(<TailorOrdersPage />)} />
    <Route path="/tailor/orders/:id" element={studio(<TailorOrderDetailPage />)} />
    <Route path="/tailor/profile" element={studio(<TailorProfilePage />)} />
  </>
);
