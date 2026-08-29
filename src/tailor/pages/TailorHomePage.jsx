import { Link } from "react-router-dom";
import Button from "../../shared/components/Button";
import StudioLayout from "../components/StudioLayout";
import StatCard from "../components/StatCard";
import RequestCard from "../components/RequestCard";
import { getRequestsForTailor } from "../../services/requestService";
import { getOrdersForTailor } from "../../services/orderService";
import { formatMmk } from "../../shared/utils/format";
import { getActingTailor } from "../../auth/activeIdentity";
import { isPendingRequest, studioStats } from "../studioUtils";

export default function TailorHomePage() {
  const studio = getActingTailor();
  const requests = getRequestsForTailor(studio.id);
  const orders = getOrdersForTailor(studio.id);
  const stats = studioStats(requests, orders);
  const newest = requests.filter(isPendingRequest);

  return (
    <StudioLayout>
      <p className="eyebrow">{studio.name}</p>
      <h1 className="serif studio-title">Tailor Studio</h1>
      <p className="muted">Review incoming PatternX work and keep orders moving.</p>
      <div className="stat-grid">
        <StatCard label="Pending Requests" value={stats.pending} />
        <StatCard label="Active Orders" value={stats.active} />
        <StatCard label="Completed Orders" value={stats.completed} />
        <StatCard label="Revenue" value={formatMmk(stats.revenue)} />
      </div>
      <div className="hero__actions">
        <Link to="/tailor/dashboard">
          <Button variant="primary">Dashboard</Button>
        </Link>
        <Link to="/tailor/requests">
          <Button variant="secondary">Requests</Button>
        </Link>
        <Link to="/tailor/orders">
          <Button variant="secondary">Orders</Button>
        </Link>
        <Link to="/tailor/profile">
          <Button variant="ghost">Profile</Button>
        </Link>
      </div>
      <h2 className="serif">New Requests</h2>
      {newest.length ? (
        <div className="studio-list">
          {newest.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <p className="muted">No new customer requests yet.</p>
      )}
    </StudioLayout>
  );
}
