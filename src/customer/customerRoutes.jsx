import { Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AssistantPage from "./pages/AssistantPage";
import RequirementsPage from "./pages/RequirementsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import TailorDetailPage from "./pages/TailorDetailPage";
import CustomizePage from "./pages/CustomizePage";
import MeasurementsPage from "./pages/MeasurementsPage";
import ReviewPage from "./pages/ReviewPage";
import OrderConfirmedPage from "./pages/OrderConfirmedPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProtectedRoute from "../auth/ProtectedRoute";

function customerOnly(element) {
  return <ProtectedRoute role="customer">{element}</ProtectedRoute>;
}

const customerScreens = [
  { path: "", element: <HomePage />, public: true },
  { path: "assistant", element: customerOnly(<AssistantPage />) },
  { path: "requirements", element: customerOnly(<RequirementsPage />) },
  { path: "recommendations", element: customerOnly(<RecommendationsPage />) },
  { path: "tailor/:id", element: <TailorDetailPage />, public: true },
  { path: "customize", element: customerOnly(<CustomizePage />) },
  { path: "measurements", element: customerOnly(<MeasurementsPage />) },
  { path: "review", element: customerOnly(<ReviewPage />) },
  { path: "order-confirmed", element: customerOnly(<OrderConfirmedPage />) },
  { path: "orders", element: customerOnly(<OrdersPage />) },
  { path: "orders/:id", element: customerOnly(<OrderDetailPage />) },
];

function pathFor(prefix, segment) {
  if (!segment) return prefix || "/";
  return `${prefix}/${segment}`.replace(/\/+/g, "/");
}

export const customerRoutes = (
  <>
    {customerScreens.map((screen) => (
      <Route
        key={`root-${screen.path || "home"}`}
        path={pathFor("", screen.path)}
        element={screen.element}
      />
    ))}
    {customerScreens.map((screen) => (
      <Route
        key={`ns-${screen.path || "home"}`}
        path={pathFor("/customer", screen.path)}
        element={screen.element}
      />
    ))}
  </>
);
