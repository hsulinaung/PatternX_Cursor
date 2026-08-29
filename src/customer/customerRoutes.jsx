import { Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AssistantPage from "./pages/AssistantPage";
import RequirementsPage from "./pages/RequirementsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import TailorDetailPage from "./pages/TailorDetailPage";
import PlaceholderPage from "./pages/PlaceholderPage";

const customerScreens = [
  { path: "", element: <HomePage /> },
  { path: "assistant", element: <AssistantPage /> },
  { path: "requirements", element: <RequirementsPage /> },
  { path: "recommendations", element: <RecommendationsPage /> },
  { path: "tailor/:id", element: <TailorDetailPage /> },
  {
    path: "customize",
    element: (
      <PlaceholderPage
        title="Customize"
        note="Color, fabric, fit, measurements, notes, and a reference image."
        nextTo="/review"
        nextLabel="Review order"
      />
    ),
  },
  {
    path: "review",
    element: (
      <PlaceholderPage
        title="Order review"
        note="A full PatternX order summary before confirmation."
        nextTo="/order-confirmed"
        nextLabel="Confirm (placeholder)"
      />
    ),
  },
  {
    path: "order-confirmed",
    element: (
      <PlaceholderPage
        title="Your order is ready"
        note="Confirmation and order ID will appear after the real confirm flow."
        nextTo="/orders"
        nextLabel="View my orders"
      />
    ),
  },
  {
    path: "orders",
    element: (
      <PlaceholderPage
        title="My orders"
        note="Tracking from Confirmed through Completed will show here."
      />
    ),
  },
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
