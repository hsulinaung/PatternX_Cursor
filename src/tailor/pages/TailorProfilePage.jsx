import StudioLayout from "../components/StudioLayout";
import Avatar from "../../shared/components/Avatar";
import Badge from "../../shared/components/Badge";
import { getTailorById } from "../../shared/data/tailors";
import { formatCompletion, formatPriceRange } from "../../shared/utils/format";
import { DEMO_TAILOR } from "../demoTailor";

export default function TailorProfilePage() {
  const tailor = getTailorById(DEMO_TAILOR.id);

  if (!tailor) {
    return (
      <StudioLayout>
        <p className="form-error">Aung Tailoring is missing from the catalog.</p>
      </StudioLayout>
    );
  }

  return (
    <StudioLayout>
      <p className="eyebrow">Studio profile</p>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <Avatar src={tailor.profileImage} name={tailor.name} size="lg" />
        <div>
          <h1 className="serif studio-title" style={{ margin: 0 }}>
            {tailor.name}
          </h1>
          <p className="muted">{tailor.location}</p>
          <Badge tone="gold">★ {tailor.rating}</Badge>
        </div>
      </div>
      <p style={{ maxWidth: 560 }}>{tailor.description}</p>
      <p>
        <strong>Specialties:</strong> {tailor.specialties.join(", ")}
      </p>
      <p>
        {formatPriceRange(tailor.priceMin, tailor.priceMax)} · {formatCompletion(tailor.completionDays)}
      </p>
      <div className="sample-grid">
        {tailor.sampleImages.map((src) => (
          <img key={src} src={src} alt={`Work by ${tailor.name}`} />
        ))}
      </div>
    </StudioLayout>
  );
}
