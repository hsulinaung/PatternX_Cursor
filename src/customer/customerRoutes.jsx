import { Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AssistantPage from "./pages/AssistantPage";
import RequirementsPage from "./pages/RequirementsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import TailorDetailPage from "./pages/TailorDetailPage";
import CustomizePage from "./pages/CustomizePage";
import ReviewPage from "./pages/ReviewPage";
import OrderConfirmedPage from "./pages/OrderConfirmedPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";

const customerScreens = [
  { path: "", element: <HomePage /> },
  { path: "assistant", element: <AssistantPage /> },
  { path: "requirements", element: <RequirementsPage /> },
  { path: "recommendations", element: <RecommendationsPage /> },
  { path: "tailor/:id", element: <TailorDetailPage /> },
  { path: "customize", element: <CustomizePage /> },
  { path: "review", element: <ReviewPage /> },
  { path: "order-confirmed", element: <OrderConfirmedPage /> },
  { path: "orders", element: <OrdersPage /> },
  { path: "orders/:id", element: <OrderDetailPage /> },
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
