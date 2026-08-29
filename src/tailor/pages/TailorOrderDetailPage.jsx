import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudioLayout from "../components/StudioLayout";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import Badge from "../../shared/components/Badge";
import EmptyState from "../../shared/components/EmptyState";
import { getOrderById, updateOrder } from "../../services/orderService";
import { getDesignRequestById } from "../../services/requestService";
import { formatMmk, formatPriceRange, displayValue } from "../../shared/utils/format";
import { formatDisplayDate } from "../../shared/utils/dates";
import { getActingTailor } from "../../auth/activeIdentity";
import { resolveCustomerName } from "../studioUtils";

const STATUSES = ["Confirmed", "In Production", "Ready", "Completed"];
const TIMELINE = ["Confirmed", "In Production", "Ready", "Completed"];

export default function TailorOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(() => getOrderById(id));
  const [error, setError] = useState("");
  const [nextStatus, setNextStatus] = useState(order?.status || "Confirmed");

  const studio = getActingTailor();
  if (!order || order.tailorId !== studio.id) {
    return (
      <StudioLayout>
        <EmptyState
          title="Order not found"
          message="That PatternX order is not assigned to Aung Tailoring."
          actionLabel="All orders"
          onAction={() => navigate("/tailor/orders")}
        />
      </StudioLayout>
    );
  }

  const request = order.requestId ? getDesignRequestById(order.requestId) : null;
  const custom = order.customization || request?.customization || {};
  const reqs = request?.requirements || {};
  const step = Math.max(0, TIMELINE.indexOf(order.status === "Tailor Accepted" ? "Confirmed" : order.status));

  function saveStatus() {
    if (!STATUSES.includes(nextStatus)) {
      setError("Choose a valid status.");
      return;
    }
    const updated = updateOrder(order.orderId, { status: nextStatus });
    if (!updated) {
      setError("Could not update the order. Check browser storage and try again.");
      return;
    }
    setOrder(updated);
    setError("");
  }

  return (
    <StudioLayout>
      <p className="eyebrow">Order {order.orderId}</p>
      <h1 className="serif studio-title">{resolveCustomerName(order)}</h1>
      <Badge tone="gold">{order.status}</Badge>
      <Card className="req-card">
        <dl className="req-grid">
          <div>
            <dt>Clothing</dt>
            <dd>{displayValue(order.clothingType)}</dd>
          </div>
          <div>
            <dt>Price</dt>
            <dd>{formatMmk(order.price)}</dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd>{displayValue(formatDisplayDate(order.deadline) || order.deadline)}</dd>
          </div>
          <div>
            <dt>Budget</dt>
            <dd>{formatPriceRange(custom.budgetMin ?? request?.budgetMin, custom.budgetMax ?? request?.budgetMax)}</dd>
          </div>
          <div>
            <dt>Style</dt>
            <dd>{displayValue(custom.style || reqs.style || order.style)}</dd>
          </div>
          <div>
            <dt>Color</dt>
            <dd>{displayValue(custom.color || order.color)}</dd>
          </div>
          <div>
            <dt>Fit</dt>
            <dd>{displayValue(custom.fit)}</dd>
          </div>
          <div>
            <dt>Request</dt>
            <dd>{displayValue(order.requestId)}</dd>
          </div>
        </dl>
        {order.notes || custom.notes ? (
          <p>
            <strong>Notes: </strong>
            {order.notes || custom.notes}
          </p>
        ) : null}
        {request?.referenceImage ? (
          <img className="ref-preview" src={request.referenceImage} alt="Reference" />
        ) : null}
      </Card>

      <h2 className="serif">Progress</h2>
      <ol className="timeline">
        {TIMELINE.map((label, index) => (
          <li key={label} className={index <= step ? "is-done" : ""}>
            <span>{index <= step ? "✓" : "○"}</span>
            {label}
          </li>
        ))}
      </ol>

      <label className="muted">
        Update status
        <select
          className="studio-select"
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value)}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="hero__actions">
        <Button variant="primary" onClick={saveStatus}>
          Update Status
        </Button>
        <Button variant="secondary" onClick={() => navigate("/tailor/orders")}>
          All orders
        </Button>
      </div>
    </StudioLayout>
  );
}
