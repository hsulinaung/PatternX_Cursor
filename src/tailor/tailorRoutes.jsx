import { Route } from "react-router-dom";
import TailorHomePage from "./pages/TailorHomePage";
import TailorPlaceholderPage from "./pages/TailorPlaceholderPage";

export const tailorRoutes = (
  <>
    <Route path="/tailor" element={<TailorHomePage />} />
    <Route path="/tailor/dashboard" element={<TailorPlaceholderPage title="Dashboard" />} />
    <Route path="/tailor/requests" element={<TailorPlaceholderPage title="Incoming requests" />} />
    <Route path="/tailor/requests/:id" element={<TailorPlaceholderPage title="Request details" />} />
    <Route path="/tailor/orders" element={<TailorPlaceholderPage title="Order management" />} />
    <Route path="/tailor/orders/:id" element={<TailorPlaceholderPage title="Tailor order" />} />
    <Route path="/tailor/profile" element={<TailorPlaceholderPage title="Tailor profile" />} />
  </>
);
