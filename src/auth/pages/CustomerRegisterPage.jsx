import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";
import { useAuth } from "../AuthContext";
import { readLocalImage } from "../readLocalImage";
import "../auth.css";

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CustomerRegisterPage() {
  const { registerCustomer } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    preferredLocation: "",
    stylePreferences: "",
    password: "",
    confirm: "",
    profileImage: null,
    nrcImage: null,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onImage(key, file) {
    const result = await readLocalImage(file);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    set(key, result.data);
    if (result.truncated) setError("That image is large, so only a placeholder was kept.");
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Full name is required.");
    if (!form.phone.trim()) return setError("Phone number is required.");
    if (form.email && !EMAIL_OK.test(form.email)) return setError("Enter a valid email, or leave it blank.");
    if (!form.password || form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Confirm password must match.");

    setBusy(true);
    const result = await registerCustomer(form);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/");
  }

  return (
    <PageContainer className="auth-page">
      <p className="eyebrow">Customer</p>
      <h1 className="serif">Create your PatternX account</h1>
      <p className="muted">Tell us who you are, then start describing what you want to wear.</p>
      <form onSubmit={submit}>
        <div className="auth-sections">
          <Card>
            <h2 className="serif" style={{ marginTop: 0 }}>
              Personal information
            </h2>
            <div className="auth-grid req-form">
              <label>
                Full name
                <input value={form.name} onChange={(e) => set("name", e.target.value)} />
              </label>
              <label>
                Email
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </label>
              <label>
                Phone number
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </label>
              <label>
                Location
                <input value={form.location} onChange={(e) => set("location", e.target.value)} />
              </label>
              <label>
                Preferred location
                <input value={form.preferredLocation} onChange={(e) => set("preferredLocation", e.target.value)} />
              </label>
              <label>
                Style preferences
                <input value={form.stylePreferences} onChange={(e) => set("stylePreferences", e.target.value)} />
              </label>
              <label>
                Profile photo
                <input type="file" accept="image/*" onChange={(e) => onImage("profileImage", e.target.files?.[0])} />
                {form.profileImage ? <img className="image-preview" src={form.profileImage} alt="" /> : null}
              </label>
            </div>
          </Card>
          <Card>
            <h2 className="serif" style={{ marginTop: 0 }}>
              Verification
            </h2>
            <p className="muted">
              Upload a verification document for the demo. PatternX does not verify NRC or identity in this MVP.
            </p>
            <label className="muted">
              Verification document
              <input type="file" accept="image/*" onChange={(e) => onImage("nrcImage", e.target.files?.[0])} />
            </label>
            {form.nrcImage ? <img className="image-preview image-preview--wide" src={form.nrcImage} alt="Document preview" /> : null}
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
          Create Customer Account
        </Button>
      </form>
    </PageContainer>
  );
}
