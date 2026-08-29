import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import Avatar from "../../shared/components/Avatar";
import EmptyState from "../../shared/components/EmptyState";
import MeasurementList from "../../shared/components/MeasurementList";
import { getTailorById } from "../../shared/data/tailors";
import { loadJourney, saveCustomization, saveJourney } from "../../services/journeyService";
import { getMeasurementProfile } from "../../services/measurementService";
import { getActingCustomer } from "../../auth/activeIdentity";
import { defaultCustomization } from "../utils/orderHelpers";
import { sourceLabel } from "../../shared/utils/measurements";

const MAX_IMAGE_CHARS = 350000;

export default function CustomizePage() {
  const navigate = useNavigate();
  const journey = loadJourney();
  const tailor = getTailorById(journey.selectedTailorId);
  const [form, setForm] = useState(defaultCustomization(journey.requirements || {}, journey.customization || {}));
  const [error, setError] = useState("");
  const [imageNote, setImageNote] = useState("");
  const profile = getMeasurementProfile(getActingCustomer().customerId);

  if (!tailor) {
    return (
      <PageContainer>
        <EmptyState
          title="No tailor selected"
          message="Choose a recommended atelier before customizing your order."
          actionLabel="See recommendations"
          onAction={() => navigate("/recommendations")}
        />
      </PageContainer>
    );
  }

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageNote("Please choose an image file. You can continue without one.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = typeof reader.result === "string" ? reader.result : "";
      if (data.length > MAX_IMAGE_CHARS) {
        set("referenceImage", null);
        set("referenceImageName", file.name);
        setImageNote("Image is large, so only the file name was kept. You can still review the order.");
        return;
      }
      set("referenceImage", data);
      set("referenceImageName", file.name);
      setImageNote("");
    };
    reader.onerror = () => {
      setImageNote("The image could not be read. Continue without it if you like.");
    };
    reader.readAsDataURL(file);
  }

  function goToMeasurements(mode) {
    saveCustomization(form);
    saveJourney({ selectedTailorId: tailor.id, customization: form });
    const query = mode ? `?mode=${mode}` : "";
    navigate(`/measurements${query}`);
  }

  function review() {
    if (!form.clothingType) {
      setError("Add a clothing type so PatternX can write the order.");
      return;
    }
    setError("");
    saveCustomization(form);
    saveJourney({ selectedTailorId: tailor.id, customization: form });
    navigate("/review");
  }

  return (
    <PageContainer>
      <p className="eyebrow">Customization</p>
      <h1 className="serif" style={{ fontSize: "2.4rem", marginTop: 4 }}>
        Shape the piece
      </h1>
      <Card className="req-card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Avatar src={tailor.profileImage} name={tailor.name} />
        <div>
          <strong>{tailor.name}</strong>
          <p className="muted" style={{ margin: 0 }}>
            {tailor.location}
          </p>
        </div>
      </Card>
      <div className="req-form">
        <label>
          Clothing type
          <input value={form.clothingType} onChange={(e) => set("clothingType", e.target.value)} />
        </label>
        <label>
          Style
          <input value={form.style} onChange={(e) => set("style", e.target.value)} />
        </label>
        <label>
          Color
          <input value={form.color} onChange={(e) => set("color", e.target.value)} />
        </label>
        <label>
          Fabric
          <input value={form.fabric} onChange={(e) => set("fabric", e.target.value)} />
        </label>
        <label>
          Fit
          <input value={form.fit} onChange={(e) => set("fit", e.target.value)} />
        </label>
        <label>
          Deadline
          <input type="date" value={form.deadline || ""} onChange={(e) => set("deadline", e.target.value)} />
        </label>
        <label>
          Budget min (MMK)
          <input
            type="number"
            value={form.budgetMin ?? ""}
            onChange={(e) => set("budgetMin", e.target.value ? Number(e.target.value) : null)}
          />
        </label>
        <label>
          Budget max (MMK)
          <input
            type="number"
            value={form.budgetMax ?? ""}
            onChange={(e) => set("budgetMax", e.target.value ? Number(e.target.value) : null)}
          />
        </label>
        <label className="req-form__full">
          Additional notes
          <textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </label>
        <label className="req-form__full">
          Reference image
          <input type="file" accept="image/*" onChange={onImage} />
        </label>
      </div>
      {form.referenceImage ? (
        <img className="ref-preview" src={form.referenceImage} alt="Reference preview" />
      ) : form.referenceImageName ? (
        <p className="muted">Reference file: {form.referenceImageName}</p>
      ) : null}
      {imageNote ? <p className="muted">{imageNote}</p> : null}

      <Card className="req-card measure-attach">
        <p className="eyebrow">Optional</p>
        <h2 className="serif" style={{ marginTop: 0 }}>
          Get my measurements
        </h2>
        <p className="muted">
          Attach AI-estimated or manual measurements to this order. You can skip this and review without
          them.
        </p>
        {form.measurements ? (
          <MeasurementList
            measurements={form.measurements}
            source={form.measurementSource}
            title="Attached to this order"
          />
        ) : profile ? (
          <p className="muted">
            Saved profile available · {sourceLabel(profile.source)} ·{" "}
            {new Date(profile.updatedAt).toLocaleDateString()}
          </p>
        ) : null}
        <div className="hero__actions">
          <Button variant="gold" onClick={() => goToMeasurements(form.measurements || profile ? "" : "camera")}>
            Get My Measurements
          </Button>
          <Button variant="secondary" onClick={() => goToMeasurements("manual")}>
            Enter Manually
          </Button>
        </div>
      </Card>

      {error ? <p className="form-error">{error}</p> : null}
      <div className="hero__actions">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="primary" onClick={review}>
          Review Order
        </Button>
      </div>
    </PageContainer>
  );
}
