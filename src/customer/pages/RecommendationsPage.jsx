import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import Badge from "../../shared/components/Badge";
import Avatar from "../../shared/components/Avatar";
import EmptyState from "../../shared/components/EmptyState";
import { loadJourney, saveJourney, saveRequirements } from "../../services/journeyService";
import { matchTailors } from "../../services/matchingService";
import { emptyRequirements, normalizeRequirements } from "../../shared/utils/requirementParser";
import { formatCompletion, formatPriceRange } from "../../shared/utils/format";
import { RequirementsForm, validateRequirements } from "./RequirementsPage";

function TailorCard({ match, featured, onChoose }) {
  const { tailor, score, reasons, explanation } = match;
  return (
    <article className={`card match-card ${featured ? "match-card--top" : ""}`}>
      {featured ? <p className="eyebrow">Top match</p> : null}
      <div className="match-card__head">
        <Avatar src={tailor.profileImage} name={tailor.name} size="lg" />
        <div>
          <div className="match-score">{score}%</div>
          <h2 className="serif" style={{ margin: "4px 0 6px", fontSize: featured ? "2rem" : "1.45rem" }}>
            {tailor.name}
          </h2>
          <Badge tone="gold">★ {tailor.rating}</Badge>
          <p className="muted">{tailor.location}</p>
        </div>
      </div>
      <p>{tailor.specialties.join(" · ")}</p>
      <p>
        <strong>{formatPriceRange(tailor.priceMin, tailor.priceMax)}</strong>
        <span className="muted"> · {formatCompletion(tailor.completionDays)}</span>
      </p>
      <Badge tone={tailor.available ? "success" : "default"}>
        {tailor.available ? "Available" : "Unavailable"}
      </Badge>
      <p className="why">
        <strong>Why PatternX recommends this</strong>
      </p>
      <ul className="why-list">
        {reasons.map((reason) => (
          <li key={reason}>✓ {reason}</li>
        ))}
      </ul>
      {featured ? <p className="explain">{explanation}</p> : null}
      <div className="hero__actions">
        <Button variant={featured ? "gold" : "primary"} onClick={() => onChoose(tailor)}>
          Choose This Tailor
        </Button>
        <Link to={`/tailor/${tailor.id}`}>View details</Link>
      </div>
    </article>
  );
}

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const journey = loadJourney();
  const starting = journey.requirements || emptyRequirements();
  const [draft, setDraft] = useState(starting);
  const [applied, setApplied] = useState(starting);
  const [error, setError] = useState("");
  const matches = useMemo(() => matchTailors(applied), [applied]);
  const top = matches[0];
  const rest = matches.slice(1);

  function updateMatches() {
    const next = normalizeRequirements(draft);
    const problem = validateRequirements(next);
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setApplied(next);
    saveRequirements(next);
  }

  function choose(tailor) {
    const match = matches.find((m) => m.tailor.id === tailor.id);
    saveJourney({
      selectedTailorId: tailor.id,
      requirements: applied,
      matches,
      matchScore: match?.score ?? null,
    });
    navigate(`/tailor/${tailor.id}`);
  }

  if (!journey.requirements && !journey.originalRequest) {
    return (
      <PageContainer>
        <EmptyState
          title="No matches yet"
          message="Describe what you want to wear and PatternX will rank ateliers for you."
          actionLabel="Start with the assistant"
          onAction={() => navigate("/assistant")}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <p className="eyebrow">AI recommendation</p>
      <h1 className="serif" style={{ fontSize: "2.4rem", marginTop: 4 }}>
        Tailors for your request
      </h1>
      {top ? (
        <p className="lead-line">
          Based on your {applied.clothingType ? applied.clothingType.toLowerCase() : "request"}
          {applied.deadlineLabel ? `, ${applied.deadlineLabel.toLowerCase()} deadline` : ""}
          {applied.budgetMax || applied.budgetMin ? ", and budget" : ""}, PatternX found {matches.length}{" "}
          suitable tailor{matches.length === 1 ? "" : "s"}.
        </p>
      ) : (
        <EmptyState
          title="No perfect match found"
          message="No perfect match found within your current requirements. Try increasing your budget or extending your deadline."
          actionLabel="Adjust Requirements"
          onAction={() => navigate("/requirements")}
        />
      )}

      <Card className="req-edit">
        <h3 className="serif" style={{ marginTop: 0 }}>
          Update what PatternX should optimize for
        </h3>
        <RequirementsForm value={draft} onChange={setDraft} error={error} />
        <Button variant="primary" onClick={updateMatches}>
          Update Matches
        </Button>
      </Card>

      {top ? (
        <>
          <p className="eyebrow" style={{ marginTop: 28 }}>
            PatternX Top Match
          </p>
          <TailorCard match={top} featured onChoose={choose} />
          {rest.length ? (
            <p style={{ marginTop: 20 }}>
              <Button
                variant="secondary"
                onClick={() => document.getElementById("other-matches")?.scrollIntoView({ behavior: "smooth" })}
              >
                See Other Options
              </Button>
            </p>
          ) : null}
        </>
      ) : null}

      {rest.length ? (
        <div id="other-matches" className="match-grid">
          {rest.map((match) => (
            <TailorCard key={match.tailor.id} match={match} onChoose={choose} />
          ))}
        </div>
      ) : null}
    </PageContainer>
  );
}
