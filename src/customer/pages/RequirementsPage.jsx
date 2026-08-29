import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import { loadJourney, saveRequirements } from "../../services/journeyService";
import { emptyRequirements, normalizeRequirements } from "../../shared/utils/requirementParser";
import { displayValue, formatPriceRange } from "../../shared/utils/format";
import { formatDisplayDate } from "../../shared/utils/dates";

const FIELDS = [
  ["clothingType", "Clothing"],
  ["occasion", "Occasion"],
  ["style", "Style"],
  ["color", "Color"],
  ["location", "Location"],
];

export function RequirementsForm({ value, onChange, error }) {
  function set(key, next) {
    onChange({ ...value, [key]: next === "" ? null : next });
  }

  return (
    <div className="req-form">
      {FIELDS.map(([key, label]) => (
        <label key={key}>
          {label}
          <input value={value[key] || ""} onChange={(e) => set(key, e.target.value)} />
        </label>
      ))}
      <label>
        Budget min (MMK)
        <input
          type="number"
          min="0"
          value={value.budgetMin ?? ""}
          onChange={(e) => set("budgetMin", e.target.value ? Number(e.target.value) : null)}
        />
      </label>
      <label>
        Budget max (MMK)
        <input
          type="number"
          min="0"
          value={value.budgetMax ?? ""}
          onChange={(e) => set("budgetMax", e.target.value ? Number(e.target.value) : null)}
        />
      </label>
      <label>
        Deadline
        <input
          type="date"
          value={value.deadline || ""}
          onChange={(e) => set("deadline", e.target.value || null)}
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}

export function validateRequirements(req) {
  if (req.budgetMin != null && req.budgetMax != null && Number(req.budgetMin) > Number(req.budgetMax)) {
    return "Maximum budget must be higher than the minimum.";
  }
  return "";
}

export default function RequirementsPage() {
  const navigate = useNavigate();
  const journey = loadJourney();
  const initial = journey.requirements || emptyRequirements();
  const [req, setReq] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");

  const rows = useMemo(() => {
    const deadline = req.deadlineLabel
      ? `${req.deadlineLabel}${req.deadline ? ` (${formatDisplayDate(req.deadline)})` : ""}`
      : formatDisplayDate(req.deadline);
    return [
      ["Clothing", displayValue(req.clothingType)],
      ["Occasion", displayValue(req.occasion)],
      ["Budget", formatPriceRange(req.budgetMin, req.budgetMax)],
      ["Deadline", displayValue(deadline)],
      ["Style", displayValue(req.style)],
      ["Color", displayValue(req.color)],
      ["Location", displayValue(req.location, "Any")],
    ];
  }, [req]);

  if (!journey.originalRequest && !journey.requirements) {
    return (
      <PageContainer>
        <p className="eyebrow">Your request</p>
        <h1>No request yet</h1>
        <p style={{ color: "var(--px-muted)" }}>Start with a natural-language description.</p>
        <Link to="/assistant">
          <Button variant="primary">Talk to PatternX</Button>
        </Link>
      </PageContainer>
    );
  }

  function applyDraft() {
    const next = normalizeRequirements({
      ...draft,
      deadlineLabel: draft.deadline === req.deadline ? req.deadlineLabel : null,
    });
    const problem = validateRequirements(next);
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setReq(next);
    saveRequirements(next);
    setEditing(false);
  }

  function findMatches() {
    const next = normalizeRequirements(req);
    const problem = validateRequirements(next);
    if (problem) {
      setError(problem);
      return;
    }
    saveRequirements(next);
    navigate("/recommendations");
  }

  return (
    <PageContainer>
      <p className="eyebrow">Here's what PatternX understood</p>
      <h1 className="serif" style={{ fontSize: "2.4rem", marginTop: 4 }}>
        Your request
      </h1>
      {journey.originalRequest ? (
        <p className="quote">“{journey.originalRequest}”</p>
      ) : null}

      <Card className="req-card">
        <dl className="req-grid">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="hero__actions">
          <Button
            variant="secondary"
            onClick={() => {
              setDraft(req);
              setEditing(true);
            }}
          >
            Edit Requirements
          </Button>
          <Button variant="primary" onClick={findMatches}>
            Find My Matches
          </Button>
        </div>
        {error && !editing ? <p className="form-error">{error}</p> : null}
      </Card>

      {editing ? (
        <div className="drawer-backdrop" onClick={() => setEditing(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <h2 className="serif">Adjust what PatternX heard</h2>
            <RequirementsForm value={draft} onChange={setDraft} error={error} />
            <div className="hero__actions">
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={applyDraft}>
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
}
