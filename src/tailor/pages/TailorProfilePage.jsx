import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudioLayout from "../components/StudioLayout";
import Avatar from "../../shared/components/Avatar";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import { getPublicTailor } from "../../shared/data/tailors";
import { formatCompletion, formatPriceRange } from "../../shared/utils/format";
import { useAuth } from "../../auth/AuthContext";
import { getActingTailor } from "../../auth/activeIdentity";
import { readLocalImage } from "../../auth/readLocalImage";
import { LANGUAGES, SPECIALTIES, STYLES, toggleList } from "../profileOptions";

const MAX_WORK = 10;

export default function TailorProfilePage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const studio = getActingTailor();
  const live = getPublicTailor(studio.id) || {};
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [form, setForm] = useState(() => formFrom(live, user));

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit() {
    setForm(formFrom(getPublicTailor(studio.id) || {}, user));
    setError("");
    setNote("");
    setEditing(true);
  }

  async function onPhoto(file) {
    const result = await readLocalImage(file);
    if (!result.ok) return setError(result.error);
    if (result.truncated) return setError("That photo is too large. Try a smaller image.");
    set("profileImage", result.data);
  }

  async function onWorks(files) {
    const next = [...form.sampleImages];
    for (const file of [...files]) {
      if (next.length >= MAX_WORK) break;
      const result = await readLocalImage(file);
      if (result.ok && result.data) next.push(result.data);
      else if (result.truncated) setNote("One photo was skipped because it was too large.");
    }
    set("sampleImages", next);
  }

  function removeWork(index) {
    set(
      "sampleImages",
      form.sampleImages.filter((_, i) => i !== index)
    );
  }

  function save() {
    if (!form.name.trim()) return setError("Shop name is required.");
    if (!form.location.trim()) return setError("Location is required.");
    const priceMin = form.priceMin === "" ? null : Number(form.priceMin);
    const priceMax = form.priceMax === "" ? null : Number(form.priceMax);
    if (priceMin != null && (!Number.isFinite(priceMin) || priceMin <= 0)) {
      return setError("Enter a valid minimum price.");
    }
    if (priceMax != null && (!Number.isFinite(priceMax) || priceMax <= 0)) {
      return setError("Enter a valid maximum price.");
    }
    if (priceMin != null && priceMax != null && priceMax < priceMin) {
      return setError("Maximum price must be at least the minimum.");
    }
    const completionDaysMin = form.completionDaysMin === "" ? null : Number(form.completionDaysMin);
    const completionDaysMax = form.completionDaysMax === "" ? null : Number(form.completionDaysMax);
    if (
      (completionDaysMin != null && (!Number.isFinite(completionDaysMin) || completionDaysMin < 1)) ||
      (completionDaysMax != null && (!Number.isFinite(completionDaysMax) || completionDaysMax < 1))
    ) {
      return setError("Completion time must be at least 1 day.");
    }
    if (completionDaysMin != null && completionDaysMax != null && completionDaysMax < completionDaysMin) {
      return setError("Maximum days must be at least the minimum.");
    }

    const saved = updateProfile({
      name: form.name.trim(),
      ownerName: form.ownerName.trim(),
      location: form.location.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      description: form.description.trim(),
      highlight: form.highlight.trim(),
      hours: form.hours.trim(),
      yearsExperience: form.yearsExperience === "" ? null : Number(form.yearsExperience),
      languages: form.languages,
      specialties: form.specialties,
      styles: form.styles,
      priceMin,
      priceMax,
      completionDaysMin,
      completionDaysMax,
      profileImage: form.profileImage,
      sampleImages: form.sampleImages,
    });
    if (!saved) {
      setError("Could not save the profile. Check browser storage and try again.");
      return;
    }
    setError("");
    setNote("Saved. This is what customers will see.");
    setEditing(false);
  }

  const profile = getPublicTailor(studio.id) || live;

  return (
    <StudioLayout>
      <div className="studio-card__top">
        <div>
          <p className="eyebrow">Studio profile</p>
          <h1 className="serif studio-title" style={{ margin: 0 }}>
            {profile.name}
          </h1>
        </div>
        <div className="hero__actions" style={{ marginTop: 0 }}>
          {editing ? (
            <>
              <Button variant="primary" onClick={save}>
                Save profile
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={startEdit}>
                Edit profile
              </Button>
              <Button
                variant="gold"
                onClick={() => navigate(`/customer/tailor/${studio.id}?preview=1`)}
              >
                Customer view
              </Button>
            </>
          )}
        </div>
      </div>

      {error ? <p className="form-error">{error}</p> : null}
      {note ? <p className="muted">{note}</p> : null}

      {editing ? (
        <form className="profile-edit" onSubmit={(e) => { e.preventDefault(); save(); }}>
          <Card className="req-card">
            <h2 className="serif" style={{ marginTop: 0 }}>
              Atelier
            </h2>
            <div className="req-form">
              <label>
                Shop name
                <input value={form.name} onChange={(e) => set("name", e.target.value)} />
              </label>
              <label>
                Lead tailor
                <input value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
              </label>
              <label>
                Location
                <input value={form.location} onChange={(e) => set("location", e.target.value)} />
              </label>
              <label>
                Address
                <input value={form.address} onChange={(e) => set("address", e.target.value)} />
              </label>
              <label>
                Phone
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </label>
              <label>
                Email
                <input value={form.email} onChange={(e) => set("email", e.target.value)} />
              </label>
              <label>
                Years of experience
                <input
                  type="number"
                  value={form.yearsExperience}
                  onChange={(e) => set("yearsExperience", e.target.value)}
                />
              </label>
              <label>
                Hours
                <input value={form.hours} onChange={(e) => set("hours", e.target.value)} />
              </label>
              <label className="req-form__full">
                Short highlight
                <input value={form.highlight} onChange={(e) => set("highlight", e.target.value)} />
              </label>
              <label className="req-form__full">
                Description
                <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
              </label>
            </div>
          </Card>

          <Card className="req-card">
            <h2 className="serif" style={{ marginTop: 0 }}>
              Profile photo
            </h2>
            <div className="landing-atelier-card__top">
              <Avatar src={form.profileImage} name={form.name} size="lg" />
              <label className="muted">
                Replace photo
                <input type="file" accept="image/*" onChange={(e) => onPhoto(e.target.files?.[0])} />
              </label>
            </div>
          </Card>

          <Card className="req-card">
            <h2 className="serif" style={{ marginTop: 0 }}>
              Previous work
            </h2>
            <p className="muted">Add up to {MAX_WORK} photos. These appear on your customer profile.</p>
            <div className="work-grid">
              {form.sampleImages.map((src, index) => (
                <figure key={`${src}-${index}`} className="work-tile">
                  <img src={src} alt={`Previous work ${index + 1}`} />
                  <button type="button" onClick={() => removeWork(index)}>
                    Remove
                  </button>
                </figure>
              ))}
            </div>
            {form.sampleImages.length < MAX_WORK ? (
              <label className="muted">
                Add photos
                <input type="file" accept="image/*" multiple onChange={(e) => onWorks(e.target.files)} />
              </label>
            ) : null}
          </Card>

          <Card className="req-card">
            <h2 className="serif" style={{ marginTop: 0 }}>
              Services
            </h2>
            <p className="muted">Specialties</p>
            <div className="chips">
              {SPECIALTIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`chip${form.specialties.includes(item) ? " is-on" : ""}`}
                  onClick={() => set("specialties", toggleList(form.specialties, item))}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="muted">Styles</p>
            <div className="chips">
              {STYLES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`chip${form.styles.includes(item) ? " is-on" : ""}`}
                  onClick={() => set("styles", toggleList(form.styles, item))}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="muted">Languages</p>
            <div className="chips">
              {LANGUAGES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`chip${form.languages.includes(item) ? " is-on" : ""}`}
                  onClick={() => set("languages", toggleList(form.languages, item))}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="req-form">
              <label>
                Price min (MMK)
                <input type="number" value={form.priceMin} onChange={(e) => set("priceMin", e.target.value)} />
              </label>
              <label>
                Price max (MMK)
                <input type="number" value={form.priceMax} onChange={(e) => set("priceMax", e.target.value)} />
              </label>
              <label>
                Completion min (days)
                <input
                  type="number"
                  value={form.completionDaysMin}
                  onChange={(e) => set("completionDaysMin", e.target.value)}
                />
              </label>
              <label>
                Completion max (days)
                <input
                  type="number"
                  value={form.completionDaysMax}
                  onChange={(e) => set("completionDaysMax", e.target.value)}
                />
              </label>
            </div>
          </Card>
        </form>
      ) : (
        <>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <Avatar src={profile.profileImage} name={profile.name} size="lg" />
            <div>
              <p className="muted">{profile.location}</p>
              {profile.rating ? <Badge tone="gold">★ {profile.rating}</Badge> : <Badge>Tailor</Badge>}
            </div>
          </div>
          <p style={{ maxWidth: 560 }}>{profile.description}</p>
          {profile.highlight ? <p className="landing-atelier-card__highlight">{profile.highlight}</p> : null}
          <dl className="req-grid">
            <div>
              <dt>Lead tailor</dt>
              <dd>{profile.ownerName || "—"}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>
                {profile.phone || "—"} · {profile.email || "—"}
              </dd>
            </div>
            <div>
              <dt>Specialties</dt>
              <dd>{profile.specialties?.join(", ") || "—"}</dd>
            </div>
            <div>
              <dt>Styles</dt>
              <dd>{profile.styles?.join(", ") || "—"}</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>{formatPriceRange(profile.priceMin, profile.priceMax)}</dd>
            </div>
            <div>
              <dt>Turnaround</dt>
              <dd>{formatCompletion(profile.completionDays)}</dd>
            </div>
          </dl>
          {profile.sampleImages?.length ? (
            <div className="work-grid">
              {profile.sampleImages.map((src, index) => (
                <img key={`${src}-${index}`} src={src} alt={`Work by ${profile.name}`} />
              ))}
            </div>
          ) : (
            <p className="muted">No previous-work photos yet. Edit your profile to add them.</p>
          )}
        </>
      )}
    </StudioLayout>
  );
}

function formFrom(live, user) {
  return {
    name: live.name || user?.name || "",
    ownerName: live.ownerName || user?.ownerName || "",
    location: live.location || "",
    address: live.address || user?.address || "",
    phone: live.phone || user?.phone || "",
    email: live.email || user?.email || "",
    description: live.description || "",
    highlight: live.highlight || "",
    hours: live.hours || "",
    yearsExperience: live.yearsExperience ?? "",
    languages: live.languages || [],
    specialties: live.specialties || [],
    styles: live.styles || [],
    priceMin: live.priceMin ?? "",
    priceMax: live.priceMax ?? "",
    completionDaysMin: live.completionDays?.min ?? "",
    completionDaysMax: live.completionDays?.max ?? "",
    profileImage: live.profileImage || null,
    sampleImages: live.sampleImages || [],
  };
}
