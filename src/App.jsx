import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AssistantPage from "./pages/AssistantPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import TailorDetailPage from "./pages/TailorDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route
            path="/requirements"
            element={
              <PlaceholderPage
                title="Your request"
                note="Extracted requirements will appear here so you can edit the AI’s understanding."
                nextTo="/recommendations"
                nextLabel="See recommendations"
              />
            }
          />
          <Route
            path="/recommendations"
            element={
              <PlaceholderPage
                title="Tailor recommendations"
                note="Ranked ateliers and a top PatternX pick will live on this page."
                nextTo="/customize"
                nextLabel="Continue to customize"
              />
            }
          />
          <Route path="/tailor/:id" element={<TailorDetailPage />} />
          <Route
            path="/customize"
            element={
              <PlaceholderPage
                title="Customize"
                note="Color, fabric, fit, measurements, notes, and a reference image."
                nextTo="/review"
                nextLabel="Review order"
              />
            }
          />
          <Route
            path="/review"
            element={
              <PlaceholderPage
                title="Order review"
                note="A full PatternX order summary before confirmation."
                nextTo="/order-confirmed"
                nextLabel="Confirm (placeholder)"
              />
            }
          />
          <Route
            path="/order-confirmed"
            element={
              <PlaceholderPage
                title="Your order is ready"
                note="Confirmation and order ID will appear after the real confirm flow."
                nextTo="/orders"
                nextLabel="View my orders"
              />
            }
          />
          <Route
            path="/orders"
            element={
              <PlaceholderPage
                title="My orders"
                note="Tracking from Confirmed through Completed will show here."
              />
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
