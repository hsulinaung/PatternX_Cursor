import { useNavigate, useParams } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import Badge from "../../shared/components/Badge";
import EmptyState from "../../shared/components/EmptyState";
import { getOrderById } from "../../services/orderService";
import { getDesignRequestById } from "../../services/requestService";
import { getTailorById } from "../../shared/data/tailors";
import { formatCompletion, formatMmk, formatPriceRange, displayValue } from "../../shared/utils/format";
import { formatDisplayDate } from "../../shared/utils/dates";
import MeasurementList from "../../shared/components/MeasurementList";

const STEPS = [
  "Request submitted",
  "Tailor selected",
  "Order confirmed",
  "In production",
  "Ready",
  "Completed",
];

function activeStep(status) {
  if (status === "Completed") return 5;
  if (status === "Ready") return 4;
  if (status === "In Production") return 3;
  if (status === "Tailor Accepted") return 3;
  return 2;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getOrderById(id);
  const tailor = order ? getTailorById(order.tailorId) : null;
  const request = order?.requestId ? getDesignRequestById(order.requestId) : null;
  const custom = order?.customization || request?.customization || {};
  const doneThrough = order ? activeStep(order.status) : 0;

  if (!order) {
    return (
      <PageContainer>
        <EmptyState
          title="Order not found"
          message="That PatternX ID is not in your saved orders."
          actionLabel="My orders"
          onAction={() => navigate("/orders")}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <p className="eyebrow">Order {order.orderId}</p>
      <h1 className="serif" style={{ fontSize: "2.4rem", marginTop: 4 }}>
        {order.tailor || tailor?.name}
      </h1>
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
            <dt>Completion</dt>
            <dd>{formatCompletion(tailor?.completionDays)}</dd>
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
            <dt>Budget</dt>
            <dd>{formatPriceRange(custom.budgetMin, custom.budgetMax)}</dd>
          </div>
          <div>
            <dt>Request</dt>
            <dd>{displayValue(order.requestId)}</dd>
          </div>
        </dl>
        <MeasurementList
          measurements={custom.measurements}
          source={custom.measurementSource}
          title="Measurements"
        />
      </Card>
      <h2 className="serif">Progress</h2>
      <ol className="timeline">
        {STEPS.map((label, index) => (
          <li key={label} className={index <= doneThrough ? "is-done" : ""}>
            <span>{index <= doneThrough ? "✓" : "○"}</span>
            {label}
          </li>
        ))}
      </ol>
      <Button variant="secondary" onClick={() => navigate("/orders")}>
        All orders
      </Button>
    </PageContainer>
  );
}
