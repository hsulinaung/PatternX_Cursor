import { useParams } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Avatar from "../../shared/components/Avatar";
import Badge from "../../shared/components/Badge";
import { getTailorById } from "../../shared/data/tailors";
import { formatCompletion, formatPriceRange } from "../../shared/utils/format";

export default function TailorDetailPage() {
  const { id } = useParams();
  const tailor = getTailorById(id);

  if (!tailor) {
    return (
      <PageContainer className="placeholder-page">
        <h1>Tailor not found</h1>
        <p>That atelier is not in the PatternX catalog.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <Avatar src={tailor.profileImage} name={tailor.name} size="lg" />
        <div>
          <p className="eyebrow">{tailor.location}</p>
          <h1 style={{ margin: "4px 0" }}>{tailor.name}</h1>
          <Badge tone="gold">★ {tailor.rating}</Badge>
        </div>
      </div>
      <p style={{ maxWidth: 640, marginTop: 20 }}>{tailor.description}</p>
      <p style={{ color: "var(--px-muted)" }}>
        {formatPriceRange(tailor.priceMin, tailor.priceMax)} · {formatCompletion(tailor.completionDays)}
      </p>
    </PageContainer>
  );
}
