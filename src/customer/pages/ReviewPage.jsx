import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import EmptyState from "../../shared/components/EmptyState";
import { getTailorById } from "../../shared/data/tailors";
import { loadJourney, saveJourney } from "../../services/journeyService";
import { createDesignRequestRecord } from "../../services/requestService";
import { createOrder } from "../../services/orderService";
import { formatCompletion, formatPriceRange, formatMmk, displayValue } from "../../shared/utils/format";
import { formatDisplayDate } from "../../shared/utils/dates";
import { DEMO_CUSTOMER } from "../demoCustomer";
import { defaultCustomization, estimatePrice } from "../utils/orderHelpers";

export default function ReviewPage() {
  const navigate = useNavigate();
  const journey = loadJourney();
  const tailor = getTailorById(journey.selectedTailorId);
  const requirements = journey.requirements || {};
  const customization = defaultCustomization(requirements, journey.customization || {});
  const [error, setError] = useState("");
  const price = estimatePrice(
    { budgetMin: customization.budgetMin, budgetMax: customization.budgetMax },
    tailor
  );

  if (!tailor) {
    return (
      <PageContainer>
        <EmptyState
          title="Nothing to review yet"
          message="Select a tailor and customize the piece first."
          actionLabel="Find matches"
          onAction={() => navigate("/recommendations")}
        />
      </PageContainer>
    );
  }

  function confirm() {
    try {
      const request = createDesignRequestRecord({
        customerId: DEMO_CUSTOMER.customerId,
        customerName: DEMO_CUSTOMER.name,
        tailorId: tailor.id,
        clothingType: customization.clothingType,
        occasion: requirements.occasion,
        style: customization.style,
        color: customization.color,
        fabric: customization.fabric,
        budgetMin: customization.budgetMin,
        budgetMax: customization.budgetMax,
        deadline: customization.deadline,
        notes: customization.notes,
        referenceImage: customization.referenceImage || customization.referenceImageName || null,
        requirements,
        customization,
        status: "Submitted",
      });
      const order = createOrder({
        customerId: DEMO_CUSTOMER.customerId,
        customer: DEMO_CUSTOMER.name,
        tailorId: tailor.id,
        tailor: tailor.name,
        requestId: request.id,
        clothingType: customization.clothingType,
        style: customization.style,
        color: customization.color,
        occasion: requirements.occasion,
        price,
        deadline: customization.deadline,
        status: "Confirmed",
        notes: customization.notes,
        customization,
      });
      if (!order?.orderId) throw new Error("missing id");
      saveJourney({ lastOrderId: order.orderId, lastRequestId: request.id });
      navigate("/order-confirmed");
    } catch {
      setError("The order could not be saved. Check storage and try again.");
    }
  }

  const title = [customization.color, customization.style || customization.fit, customization.clothingType]
    .filter(Boolean)
    .join(" ");

  return (
    <PageContainer>
      <p className="eyebrow">Your PatternX order</p>
      <h1 className="serif" style={{ fontSize: "2.4rem", marginTop: 4 }}>
        {tailor.name}
      </h1>
      <p className="quote">{title || customization.clothingType}</p>
      <Card className="req-card">
        <dl className="req-grid">
          <div>
            <dt>Occasion</dt>
            <dd>{displayValue(requirements.occasion)}</dd>
          </div>
          <div>
            <dt>Color</dt>
            <dd>{displayValue(customization.color)}</dd>
          </div>
          <div>
            <dt>Fabric</dt>
            <dd>{displayValue(customization.fabric)}</dd>
          </div>
          <div>
            <dt>Fit</dt>
            <dd>{displayValue(customization.fit)}</dd>
          </div>
          <div>
            <dt>Budget</dt>
            <dd>{formatPriceRange(customization.budgetMin, customization.budgetMax)}</dd>
          </div>
          <div>
            <dt>Estimated price</dt>
            <dd>{formatMmk(price)}</dd>
          </div>
          <div>
            <dt>Estimated completion</dt>
            <dd>{formatCompletion(tailor.completionDays)}</dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd>{displayValue(formatDisplayDate(customization.deadline) || customization.deadline)}</dd>
          </div>
        </dl>
        {customization.notes ? (
          <p>
            <strong>Additional notes: </strong>
            {customization.notes}
          </p>
        ) : null}
        {customization.referenceImage ? (
          <img className="ref-preview" src={customization.referenceImage} alt="Reference" />
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
        <div className="hero__actions">
          <Button variant="secondary" onClick={() => navigate("/customize")}>
            Edit
          </Button>
          <Button variant="gold" onClick={confirm}>
            Confirm Order
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
