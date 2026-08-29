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

export default function TailorDashboardPage() {
  const studio = getActingTailor();
  const requests = getRequestsForTailor(studio.id);
  const orders = getOrdersForTailor(studio.id);
  const stats = studioStats(requests, orders);
  const pending = requests.filter(isPendingRequest);

  return (
    <StudioLayout>
      <p className="eyebrow">Overview</p>
      <h1 className="serif studio-title">Dashboard</h1>
      <div className="stat-grid">
        <StatCard label="Pending Requests" value={stats.pending} />
        <StatCard label="Active Orders" value={stats.active} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Revenue" value={formatMmk(stats.revenue)} />
      </div>
      <h2 className="serif">New Requests</h2>
      {pending.length ? (
        <div className="studio-list">
          {pending.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <p className="muted">No new customer requests yet.</p>
      )}
      <p style={{ marginTop: 20 }}>
        <Link to="/tailor/requests">
          <Button variant="secondary">All requests</Button>
        </Link>
      </p>
    </StudioLayout>
  );
}
