import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StudioLayout from "../components/StudioLayout";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import Badge from "../../shared/components/Badge";
import EmptyState from "../../shared/components/EmptyState";
import { getDesignRequestById, updateDesignRequest } from "../../services/requestService";
import { createOrder, getOrderByRequestId, updateOrder } from "../../services/orderService";
import { formatPriceRange, formatMmk, displayValue } from "../../shared/utils/format";
import { formatDisplayDate } from "../../shared/utils/dates";
import { getActingTailor } from "../../auth/activeIdentity";
import MeasurementList from "../../shared/components/MeasurementList";
import {
  displayRequestStatus,
  isMockRequest,
  requestMatchScore,
  resolveCustomerName,
} from "../studioUtils";

export default function TailorRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(() => getDesignRequestById(id));
  const studio = getActingTailor();
  const [error, setError] = useState("");
  const [quote, setQuote] = useState({
    price: request?.quotePrice || 220000,
    completion: request?.quoteCompletion || request?.deadline || "",
    notes: request?.quoteNotes || "Premium fabric, two fittings included.",
  });

  if (!request || request.tailorId !== studio.id) {
    return (
      <StudioLayout>
        <EmptyState
          title="Request not found"
          message="That ID is not in Aung Tailoring’s inbox."
          actionLabel="All requests"
          onAction={() => navigate("/tailor/requests")}
        />
      </StudioLayout>
    );
  }

  const custom = request.customization || {};
  const reqs = request.requirements || {};
  const match = requestMatchScore(request);
  const linkedOrder = getOrderByRequestId(request.id);

  function persist(patch) {
    const next = updateDesignRequest(request.id, patch);
    if (!next) {
      setError("Could not save the request. Check browser storage and try again.");
      return null;
    }
    setRequest(next);
    setError("");
    return next;
  }

  function accept() {
    persist({ status: "Accepted" });
  }

  function reject() {
    const next = persist({ status: "Rejected" });
    if (next) navigate("/tailor/requests");
  }

  function sendQuote() {
    const price = Number(quote.price);
    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid estimated price in MMK.");
      return;
    }
    const next = persist({
      status: "Quoted",
      quotePrice: price,
      quoteCompletion: quote.completion,
      quoteNotes: quote.notes,
    });
    if (!next) return;

    try {
      if (linkedOrder) {
        const updated = updateOrder(linkedOrder.orderId, {
          price,
          notes: quote.notes,
          deadline: quote.completion || linkedOrder.deadline,
        });
        if (!updated) throw new Error("order");
      } else {
        createOrder({
          customerId: request.customerId,
          customer: resolveCustomerName(request),
          tailorId: studio.id,
          tailor: studio.name,
          requestId: request.id,
          clothingType: request.clothingType,
          style: custom.style || request.style,
          color: custom.color || request.color,
          occasion: request.occasion,
          price,
          deadline: quote.completion || request.deadline,
          status: "Confirmed",
          notes: quote.notes,
          customization: custom,
        });
      }
    } catch {
      setError("The quote saved on the request, but the order could not be updated.");
    }
  }

  return (
    <StudioLayout>
      <p className="eyebrow">Customer request</p>
      <div className="studio-card__top">
        <h1 className="serif studio-title">{request.id}</h1>
        <div>
          <Badge tone="gold">{displayRequestStatus(request.status)}</Badge>
          {isMockRequest(request) ? <Badge>Demo</Badge> : <Badge tone="success">Live</Badge>}
        </div>
      </div>
      <h2 className="serif" style={{ marginTop: 0 }}>
        {resolveCustomerName(request)}
      </h2>
      {match != null ? <p>PatternX Match: {match}%</p> : null}

      <Card className="req-card">
        <dl className="req-grid">
          <div>
            <dt>Clothing</dt>
            <dd>{displayValue(request.clothingType)}</dd>
          </div>
          <div>
            <dt>Occasion</dt>
            <dd>{displayValue(request.occasion || reqs.occasion)}</dd>
          </div>
          <div>
            <dt>Style</dt>
            <dd>{displayValue(custom.style || request.style || reqs.style)}</dd>
          </div>
          <div>
            <dt>Color</dt>
            <dd>{displayValue(custom.color || request.color)}</dd>
          </div>
          <div>
            <dt>Fabric</dt>
            <dd>{displayValue(custom.fabric || request.fabric)}</dd>
          </div>
          <div>
            <dt>Fit</dt>
            <dd>{displayValue(custom.fit)}</dd>
          </div>
          <div>
            <dt>Budget</dt>
            <dd>{formatPriceRange(request.budgetMin, request.budgetMax)}</dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd>{displayValue(formatDisplayDate(request.deadline) || request.deadline)}</dd>
          </div>
        </dl>
        {request.notes || custom.notes ? (
          <p>
            <strong>Additional notes: </strong>
            {request.notes || custom.notes}
          </p>
        ) : null}
        {request.referenceImage && String(request.referenceImage).startsWith("data:") ? (
          <img className="ref-preview" src={request.referenceImage} alt="Customer reference" />
        ) : request.referenceImage ? (
          <img className="ref-preview" src={request.referenceImage} alt="Customer reference" />
        ) : null}
        <MeasurementList
          measurements={custom.measurements}
          source={custom.measurementSource}
          title="Customer Measurements"
        />
      </Card>

      {error ? <p className="form-error">{error}</p> : null}

      {request.status !== "Rejected" && request.status !== "Quoted" ? (
        <div className="hero__actions">
          <Button variant="primary" onClick={accept}>
            Accept Request
          </Button>
          <Button variant="secondary" onClick={reject}>
            Reject Request
          </Button>
        </div>
      ) : null}

      {request.status === "Rejected" ? <p className="form-error">This request was rejected.</p> : null}

      {request.status === "Accepted" || request.status === "Quoted" ? (
        <Card className="req-card">
          <h3 className="serif" style={{ marginTop: 0 }}>
            Quote
          </h3>
          <div className="req-form">
            <label>
              Estimated price (MMK)
              <input
                type="number"
                value={quote.price}
                onChange={(e) => setQuote({ ...quote, price: e.target.value })}
              />
            </label>
            <label>
              Estimated completion
              <input
                type="date"
                value={quote.completion || ""}
                onChange={(e) => setQuote({ ...quote, completion: e.target.value })}
              />
            </label>
            <label className="req-form__full">
              Notes
              <textarea
                rows={3}
                value={quote.notes}
                onChange={(e) => setQuote({ ...quote, notes: e.target.value })}
              />
            </label>
          </div>
          {request.status === "Quoted" ? (
            <p className="muted">Quote sent{request.quotePrice ? ` · ${formatMmk(request.quotePrice)}` : ""}.</p>
          ) : null}
          <Button variant="gold" onClick={sendQuote}>
            Send Quote
          </Button>
        </Card>
      ) : null}

      {linkedOrder ? (
        <p style={{ marginTop: 20 }}>
          <Link to={`/tailor/orders/${linkedOrder.orderId}`}>Open linked order {linkedOrder.orderId}</Link>
        </p>
      ) : null}
    </StudioLayout>
  );
}
