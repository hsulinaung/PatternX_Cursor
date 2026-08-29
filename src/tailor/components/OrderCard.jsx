import { Link } from "react-router-dom";
import Card from "../../shared/components/Card";
import Badge from "../../shared/components/Badge";
import { formatMmk } from "../../shared/utils/format";
import { formatDisplayDate } from "../../shared/utils/dates";
import { resolveCustomerName } from "../studioUtils";

export default function OrderCard({ order }) {
  return (
    <Card className="studio-card">
      <div className="studio-card__top">
        <strong>{order.orderId}</strong>
        <Badge tone="gold">{order.status}</Badge>
      </div>
      <p>{resolveCustomerName(order)}</p>
      <p>{order.clothingType || "—"}</p>
      <p>
        {formatMmk(order.price)} · {formatDisplayDate(order.deadline) || order.deadline || "—"}
      </p>
      <Link to={`/tailor/orders/${order.orderId}`}>View Order</Link>
    </Card>
  );
}
