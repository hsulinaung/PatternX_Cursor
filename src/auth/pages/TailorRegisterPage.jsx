import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";
import { useAuth } from "../AuthContext";
import { readLocalImage } from "../readLocalImage";
import "../auth.css";

const SPECIALTIES = ["Men's Suits", "Women's Dresses", "Traditional Wear", "Shirts", "Pants", "Jackets"];
const STYLES = ["Formal", "Modern", "Classic", "Traditional", "Casual", "Slim Fit"];
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toggle(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function TailorRegisterPage() {
  const { registerTailor } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    phone: "",
    email: "",
    location: "",
    address: "",
    description: "",
    specialties: [],
    styles: [],
    priceMin: "",
    priceMax: "",
    completionDaysMin: "",
    completionDaysMax: "",
    password: "",
    confirm: "",
    profileImage: null,
    sampleImages: [],
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onLogo(file) {
    const result = await readLocalImage(file);
    if (!result.ok) return setError(result.error);
    set("profileImage", result.data);
  }

  async function onSamples(files) {
    const next = [];
    for (const file of [...files].slice(0, 4)) {
      const result = await readLocalImage(file);
      if (result.ok && result.data) next.push(result.data);
    }
    set("sampleImages", next);
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Tailor / shop name is required.");
    if (!form.phone.trim()) return setError("Phone number is required.");
    if (!form.location.trim()) return setError("Location is required.");
    if (form.email && !EMAIL_OK.test(form.email)) return setError("Enter a valid email, or leave it blank.");
    const min = Number(form.priceMin);
    const max = Number(form.priceMax);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max < min) {
      return setError("Enter a valid price range.");
    }
    const dMin = Number(form.completionDaysMin);
    const dMax = Number(form.completionDaysMax);
    if (!Number.isFinite(dMin) || !Number.isFinite(dMax) || dMin < 1 || dMax < dMin) {
      return setError("Enter a valid completion time in days.");
    }
    if (!form.password || form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Confirm password must match.");

    setBusy(true);
    const result = await registerTailor({
      ...form,
      priceMin: min,
      priceMax: max,
      completionDaysMin: dMin,
      completionDaysMax: dMax,
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/tailor/dashboard");
  }

  return (
    <PageContainer className="auth-page">
      <p className="eyebrow">For ateliers</p>
      <h1 className="serif">Join PatternX as a Tailor</h1>
      <p className="muted">Turn your tailoring business into a smarter digital storefront.</p>
      <form onSubmit={submit}>
        <div className="auth-sections">
          <Card>
            <h2 className="serif" style={{ marginTop: 0 }}>
              Business information
            </h2>
            <div className="auth-grid req-form">
              <label>
                Tailor / shop name
                <input value={form.name} onChange={(e) => set("name", e.target.value)} />
              </label>
              <label>
                Owner name
                <input value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
              </label>
              <label>
                Phone number
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </label>
              <label>
                Email
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </label>
              <label>
                Location
                <input value={form.location} onChange={(e) => set("location", e.target.value)} />
              </label>
              <label>
                Address
                <input value={form.address} onChange={(e) => set("address", e.target.value)} />
              </label>
            </div>
          </Card>
          <Card>
            <h2 className="serif" style={{ marginTop: 0 }}>
              Profile
            </h2>
            <label className="muted">
              Description
              <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </label>
            <label className="muted">
              Profile image / shop logo
              <input type="file" accept="image/*" onChange={(e) => onLogo(e.target.files?.[0])} />
            </label>
            {form.profileImage ? <img className="image-preview" src={form.profileImage} alt="" /> : null}
            <label className="muted">
              Sample work
              <input type="file" accept="image/*" multiple onChange={(e) => onSamples(e.target.files)} />
            </label>
          </Card>
          <Card>
            <h2 className="serif" style={{ marginTop: 0 }}>
              Services & pricing
            </h2>
            <p className="muted">Specialties</p>
            <div className="chips">
              {SPECIALTIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="chip"
                  onClick={() => set("specialties", toggle(form.specialties, item))}
                >
                  {form.specialties.includes(item) ? "✓ " : ""}
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
                  className="chip"
                  onClick={() => set("styles", toggle(form.styles, item))}
                >
                  {form.styles.includes(item) ? "✓ " : ""}
                  {item}
                </button>
              ))}
            </div>
            <div className="auth-grid req-form">
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
                <input type="number" value={form.completionDaysMin} onChange={(e) => set("completionDaysMin", e.target.value)} />
              </label>
              <label>
                Completion max (days)
                <input type="number" value={form.completionDaysMax} onChange={(e) => set("completionDaysMax", e.target.value)} />
              </label>
            </div>
          </Card>
          <Card>
            <h2 className="serif" style={{ marginTop: 0 }}>
              Account security
            </h2>
            <div className="auth-grid req-form">
              <label>
                Password
                <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} />
              </label>
              <label>
                Confirm password
                <input type="password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} />
              </label>
            </div>
          </Card>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        <Button type="submit" variant="primary" disabled={busy}>
          Create Tailor Account
        </Button>
      </form>
    </PageContainer>
  );
}
