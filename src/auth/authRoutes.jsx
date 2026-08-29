import { Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterChoicePage from "./pages/RegisterChoicePage";
import CustomerRegisterPage from "./pages/CustomerRegisterPage";
import TailorRegisterPage from "./pages/TailorRegisterPage";
import CustomerProfilePage from "./pages/CustomerProfilePage";
import ProtectedRoute from "./ProtectedRoute";

export const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterChoicePage />} />
    <Route path="/register/customer" element={<CustomerRegisterPage />} />
    <Route path="/register/tailor" element={<TailorRegisterPage />} />
    <Route
      path="/profile"
      element={
        <ProtectedRoute role="customer">
          <CustomerProfilePage />
        </ProtectedRoute>
      }
    />
  </>
);
