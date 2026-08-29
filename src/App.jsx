import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./shared/components/Navbar";
import DemoPage from "./shared/pages/DemoPage";
import NotFoundPage from "./customer/pages/NotFoundPage";
import { customerRoutes } from "./customer/customerRoutes";
import { tailorRoutes } from "./tailor/tailorRoutes";
import { authRoutes } from "./auth/authRoutes";
import { AuthProvider } from "./auth/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <Navbar />
          <Routes>
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            {authRoutes}
            {tailorRoutes}
            {customerRoutes}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
