import StudioLayout from "../components/StudioLayout";
import Avatar from "../../shared/components/Avatar";
import Badge from "../../shared/components/Badge";
import { getTailorById } from "../../shared/data/tailors";
import { formatCompletion, formatPriceRange } from "../../shared/utils/format";
import { useAuth } from "../../auth/AuthContext";
import { getActingTailor } from "../../auth/activeIdentity";

export default function TailorProfilePage() {
  const { user } = useAuth();
  const studio = getActingTailor();
  const catalog = getTailorById(studio.id);
  const profile = {
    name: user?.name || catalog?.name || studio.name,
    ownerName: user?.ownerName,
    profileImage: user?.profileImage || catalog?.profileImage,
    location: user?.location || catalog?.location,
    address: user?.address,
    email: user?.email,
    phone: user?.phone,
    rating: catalog?.rating,
    description: user?.description || catalog?.description,
    specialties: user?.specialties?.length ? user.specialties : catalog?.specialties || [],
    styles: user?.styles?.length ? user.styles : catalog?.styles || [],
    priceMin: user?.priceMin ?? catalog?.priceMin,
    priceMax: user?.priceMax ?? catalog?.priceMax,
    completionDays: catalog?.completionDays || {
      min: user?.completionDaysMin,
      max: user?.completionDaysMax,
    },
    sampleImages: user?.sampleImages?.length ? user.sampleImages : catalog?.sampleImages || [],
  };

  return (
    <StudioLayout>
      <p className="eyebrow">Studio profile</p>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <Avatar src={profile.profileImage} name={profile.name} size="lg" />
        <div>
          <h1 className="serif studio-title" style={{ margin: 0 }}>
            {profile.name}
          </h1>
          <p className="muted">{profile.location}</p>
          {profile.rating ? <Badge tone="gold">★ {profile.rating}</Badge> : <Badge>Tailor</Badge>}
        </div>
      </div>
      <p style={{ maxWidth: 560 }}>{profile.description}</p>
      <p>
        <strong>Owner:</strong> {profile.ownerName || "—"}
      </p>
      <p>
        <strong>Phone:</strong> {profile.phone || "—"} · <strong>Email:</strong> {profile.email || "—"}
      </p>
      {profile.address ? (
        <p>
          <strong>Address:</strong> {profile.address}
        </p>
      ) : null}
      <p>
        <strong>Specialties:</strong> {profile.specialties.join(", ") || "—"}
      </p>
      <p>
        <strong>Styles:</strong> {profile.styles.join(", ") || "—"}
      </p>
      <p>
        {formatPriceRange(profile.priceMin, profile.priceMax)} · {formatCompletion(profile.completionDays)}
      </p>
      {profile.sampleImages.length ? (
        <div className="sample-grid">
          {profile.sampleImages.map((src) => (
            <img key={src} src={src} alt={`Work by ${profile.name}`} />
          ))}
        </div>
      ) : null}
    </StudioLayout>
  );
}
