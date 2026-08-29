import { Link, useNavigate, useParams } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Avatar from "../../shared/components/Avatar";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import { getTailorById } from "../../shared/data/tailors";
import { formatCompletion, formatPriceRange } from "../../shared/utils/format";
import { loadJourney, saveJourney } from "../../services/journeyService";
import EmptyState from "../../shared/components/EmptyState";

export default function TailorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tailor = getTailorById(id);
  const journey = loadJourney();
  const match = (journey.matches || []).find((m) => m.tailor?.id === id);
  const score = match?.score ?? journey.matchScore;

  if (!tailor) {
    return (
      <PageContainer>
        <EmptyState
          title="Tailor not found"
          message="That atelier is not in the PatternX catalog."
          actionLabel="See recommendations"
          onAction={() => navigate("/recommendations")}
        />
      </PageContainer>
    );
  }

  function customize() {
    saveJourney({ selectedTailorId: tailor.id });
    navigate("/customize");
  }

  return (
    <PageContainer>
      <p className="eyebrow">Atelier profile</p>
      <img className="atelier-cover" src={tailor.profileImage} alt={tailor.name} />
      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", marginTop: 20 }}>
        <Avatar src={tailor.profileImage} name={tailor.name} size="lg" />
        <div>
          <h1 style={{ margin: "4px 0" }}>{tailor.name}</h1>
          <p className="muted">{tailor.location}</p>
          <div className="hero__actions" style={{ marginTop: 8 }}>
            <Badge tone="gold">
              ★ {tailor.rating}
              {tailor.reviewCount ? ` · ${tailor.reviewCount} reviews` : ""}
            </Badge>
            <Badge tone={tailor.available ? "success" : "default"}>
              {tailor.available ? "Available" : "Unavailable"}
            </Badge>
            {score != null ? <Badge tone="gold">{score}% match</Badge> : null}
          </div>
        </div>
      </div>
      <p style={{ maxWidth: 640, marginTop: 20 }}>{tailor.description}</p>
      {tailor.highlight ? <p className="landing-atelier-card__highlight">{tailor.highlight}</p> : null}
      <dl className="req-grid" style={{ marginTop: 20 }}>
        {tailor.ownerName ? (
          <div>
            <dt>Lead tailor</dt>
            <dd>{tailor.ownerName}</dd>
          </div>
        ) : null}
        {tailor.yearsExperience ? (
          <div>
            <dt>Experience</dt>
            <dd>{tailor.yearsExperience} years</dd>
          </div>
        ) : null}
        <div>
          <dt>Specialties</dt>
          <dd>{tailor.specialties.join(", ")}</dd>
        </div>
        <div>
          <dt>Style</dt>
          <dd>{tailor.styles.join(", ")}</dd>
        </div>
        <div>
          <dt>Price</dt>
          <dd>{formatPriceRange(tailor.priceMin, tailor.priceMax)}</dd>
        </div>
        <div>
          <dt>Turnaround</dt>
          <dd>{formatCompletion(tailor.completionDays)}</dd>
        </div>
        {tailor.hours ? (
          <div>
            <dt>Hours</dt>
            <dd>{tailor.hours}</dd>
          </div>
        ) : null}
        {tailor.languages ? (
          <div>
            <dt>Languages</dt>
            <dd>{tailor.languages.join(", ")}</dd>
          </div>
        ) : null}
      </dl>
      {match?.reasons?.length ? (
        <ul className="why-list">
          {match.reasons.map((reason) => (
            <li key={reason}>✓ {reason}</li>
          ))}
        </ul>
      ) : null}
      {tailor.sampleImages?.length ? (
        <div className="sample-grid">
          {tailor.sampleImages.map((src) => (
            <img key={src} src={src} alt={`Sample from ${tailor.name}`} />
          ))}
        </div>
      ) : null}
      <div className="hero__actions">
        <Button variant="primary" onClick={customize}>
          Customize My Order
        </Button>
        <Link to="/recommendations">Back to matches</Link>
      </div>
    </PageContainer>
  );
}
