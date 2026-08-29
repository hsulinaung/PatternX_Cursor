import { Link } from "react-router-dom";
import Card from "../../shared/components/Card";
import Badge from "../../shared/components/Badge";
import { formatPriceRange } from "../../shared/utils/format";
import { formatDisplayDate } from "../../shared/utils/dates";
import { displayRequestStatus, isMockRequest, resolveCustomerName } from "../studioUtils";

export default function RequestCard({ request }) {
  return (
    <Card className="studio-card">
      <div className="studio-card__top">
        <strong>{request.id}</strong>
        <div>
          <Badge tone={isPendingLike(request.status) ? "gold" : "success"}>
            {displayRequestStatus(request.status)}
          </Badge>
          {isMockRequest(request) ? <Badge>Demo</Badge> : <Badge tone="success">Live</Badge>}
        </div>
      </div>
      <p>{resolveCustomerName(request)}</p>
      <p>
        {request.clothingType || "—"} · {request.occasion || "—"}
      </p>
      <p className="muted">
        {formatPriceRange(request.budgetMin, request.budgetMax)} ·{" "}
        {formatDisplayDate(request.deadline) || request.deadline || "No deadline"}
      </p>
      {request.style ? <p className="muted">{request.style}</p> : null}
      <Link to={`/tailor/requests/${request.id}`}>View Request</Link>
    </Card>
  );
}

function isPendingLike(status) {
  return ["Submitted", "Draft", "Pending"].includes(status);
}
