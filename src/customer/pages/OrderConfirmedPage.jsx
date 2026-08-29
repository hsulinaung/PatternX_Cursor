import { useNavigate } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import EmptyState from "../../shared/components/EmptyState";
import { loadJourney } from "../../services/journeyService";
import { getOrderById } from "../../services/orderService";
import { getTailorById } from "../../shared/data/tailors";
import { formatCompletion, formatMmk } from "../../shared/utils/format";

export default function OrderConfirmedPage() {
  const navigate = useNavigate();
  const { lastOrderId } = loadJourney();
  const order = lastOrderId ? getOrderById(lastOrderId) : null;
  const tailor = order ? getTailorById(order.tailorId) : null;

  if (!order) {
    return (
      <PageContainer>
        <EmptyState
          title="No confirmation to show"
          message="Confirm an order from the review screen to see it here."
          actionLabel="My orders"
          onAction={() => navigate("/orders")}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="confirm-page">
      <p className="confirm-mark" aria-hidden="true">
        ✓
      </p>
      <h1 className="serif" style={{ fontSize: "2.8rem", marginTop: 0 }}>
        Your PatternX order is ready!
      </h1>
      <Card className="req-card">
        <dl className="req-grid">
          <div>
            <dt>Order</dt>
            <dd>{order.orderId}</dd>
          </div>
          <div>
            <dt>Tailor</dt>
            <dd>{order.tailor || tailor?.name}</dd>
          </div>
          <div>
            <dt>Estimated price</dt>
            <dd>{formatMmk(order.price)}</dd>
          </div>
          <div>
            <dt>Estimated completion</dt>
            <dd>{formatCompletion(tailor?.completionDays)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{order.status}</dd>
          </div>
        </dl>
        <div className="hero__actions">
          <Button variant="primary" onClick={() => navigate(`/orders/${order.orderId}`)}>
            View My Order
          </Button>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
