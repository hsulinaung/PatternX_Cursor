import { useNavigate } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Card from "../../shared/components/Card";
import Badge from "../../shared/components/Badge";
import EmptyState from "../../shared/components/EmptyState";
import { getOrdersForCustomer } from "../../services/orderService";
import { formatMmk } from "../../shared/utils/format";
import { formatDisplayDate } from "../../shared/utils/dates";
import { DEMO_CUSTOMER } from "../demoCustomer";

export default function OrdersPage() {
  const navigate = useNavigate();
  const orders = getOrdersForCustomer(DEMO_CUSTOMER.customerId);

  return (
    <PageContainer>
      <p className="eyebrow">For {DEMO_CUSTOMER.name}</p>
      <h1 className="serif" style={{ fontSize: "2.4rem", marginTop: 4 }}>
        My orders
      </h1>
      {!orders.length ? (
        <EmptyState
          title="No orders yet"
          message="When you confirm a PatternX order, it will appear here."
          actionLabel="Find a tailor"
          onAction={() => navigate("/assistant")}
        />
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <button
              key={order.orderId}
              type="button"
              className="order-row"
              onClick={() => navigate(`/orders/${order.orderId}`)}
            >
              <Card>
                <div className="order-row__inner">
                  <div>
                    <strong>{order.orderId}</strong>
                    <p className="muted" style={{ margin: "4px 0 0" }}>
                      {order.tailor} · {order.clothingType}
                    </p>
                  </div>
                  <div className="order-row__meta">
                    <span>{formatMmk(order.price)}</span>
                    <Badge tone="gold">{order.status}</Badge>
                    <span className="muted">{formatDisplayDate(order.deadline) || order.deadline || "—"}</span>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
