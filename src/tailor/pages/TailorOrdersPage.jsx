import { useNavigate } from "react-router-dom";
import EmptyState from "../../shared/components/EmptyState";
import StudioLayout from "../components/StudioLayout";
import OrderCard from "../components/OrderCard";
import { getOrdersForTailor } from "../../services/orderService";
import { getActingTailor } from "../../auth/activeIdentity";

export default function TailorOrdersPage() {
  const navigate = useNavigate();
  const orders = getOrdersForTailor(getActingTailor().id);
  const active = orders.filter((o) => o.status !== "Completed");

  return (
    <StudioLayout>
      <p className="eyebrow">Workshop</p>
      <h1 className="serif studio-title">Orders</h1>
      {!orders.length ? (
        <EmptyState
          title="No active orders."
          message="Confirmed customer work for Aung Tailoring will land here."
          actionLabel="See requests"
          onAction={() => navigate("/tailor/requests")}
        />
      ) : (
        <>
          {!active.length ? <p className="muted">No active orders.</p> : null}
          <div className="studio-list">
            {orders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        </>
      )}
    </StudioLayout>
  );
}
