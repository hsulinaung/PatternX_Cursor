import { Navigate, useLocation } from "react-router-dom";
import LoadingState from "../shared/components/LoadingState";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <LoadingState label="Checking your session…" />;

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, message: "Please log in to continue." }}
      />
    );
  }

  if (role === "customer" && user.role !== "customer") {
    return <Navigate to="/tailor/dashboard" replace />;
  }

  if (role === "tailor" && user.role !== "tailor") {
    return <Navigate to="/" replace />;
  }

  return children;
}
