import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";
import { useAuth } from "../AuthContext";
import "../auth.css";

export default function LoginPage() {
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(location.state?.message || "");
  const [busy, setBusy] = useState(false);

  function afterLogin(user) {
    const next = location.state?.from;
    if (user.role === "tailor") navigate(next?.startsWith("/tailor") ? next : "/tailor/dashboard", { replace: true });
    else navigate(next && !next.startsWith("/tailor/dashboard") ? next : "/", { replace: true });
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const result = await login(identifier, password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    afterLogin(result.user);
  }

  async function demo(kind) {
    setBusy(true);
    const result = await loginDemo(kind);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    afterLogin(result.user);
  }

  return (
    <PageContainer className="auth-page">
      <p className="eyebrow">Welcome back</p>
      <h1 className="serif">Login</h1>
      <p className="muted">Use your email or phone and password. Demo accounts are for the pitch only.</p>
      <Card className="req-card">
        <form onSubmit={submit} className="req-form" style={{ gridTemplateColumns: "1fr" }}>
          <label>
            Phone or email
            <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <Button type="submit" variant="primary" disabled={busy}>
            Login
          </Button>
        </form>
        <div className="hero__actions" style={{ marginTop: 20 }}>
          <Link to="/register/customer">Create Customer Account</Link>
          <Link to="/register/tailor">Register as a Tailor</Link>
        </div>
        <p className="eyebrow" style={{ marginTop: 28 }}>
          Demo accounts
        </p>
        <div className="hero__actions">
          <Button variant="gold" disabled={busy} onClick={() => demo("customer")}>
            Demo Customer
          </Button>
          <Button variant="secondary" disabled={busy} onClick={() => demo("tailor")}>
            Demo Tailor
          </Button>
        </div>
        <p className="muted" style={{ marginTop: 8 }}>
          Hsu Lin · customer-demo &nbsp;|&nbsp; Aung Tailoring · t-aung
        </p>
      </Card>
    </PageContainer>
  );
}
