import { Link, useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button";
import EmptyState from "../../shared/components/EmptyState";
import StudioLayout from "../components/StudioLayout";
import RequestCard from "../components/RequestCard";
import { getRequestsForTailor } from "../../services/requestService";
import { getActingTailor } from "../../auth/activeIdentity";

export default function TailorRequestsPage() {
  const navigate = useNavigate();
  const requests = getRequestsForTailor(getActingTailor().id);

  return (
    <StudioLayout>
      <p className="eyebrow">Inbox</p>
      <h1 className="serif studio-title">Incoming requests</h1>
      {!requests.length ? (
        <EmptyState
          title="No new customer requests yet."
          message="When a customer confirms an order for Aung Tailoring, it will appear here."
          actionLabel="Open dashboard"
          onAction={() => navigate("/tailor/dashboard")}
        />
      ) : (
        <div className="studio-list">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
      <p style={{ marginTop: 24 }}>
        <Link to="/tailor/dashboard">
          <Button variant="ghost">Back to dashboard</Button>
        </Link>
      </p>
    </StudioLayout>
  );
}
