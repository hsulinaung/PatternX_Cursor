import { useNavigate } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Button from "../../shared/components/Button";
import { DEMO_PROMPT, tailors } from "../../shared/data/tailors";
import Avatar from "../../shared/components/Avatar";
import Badge from "../../shared/components/Badge";
import { formatPriceRange } from "../../shared/utils/format";
import { emptyRequirements } from "../../shared/utils/requirementParser";
import { saveRequirements } from "../../services/journeyService";
import { useAuth } from "../../auth/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  function goAssistant(prompt) {
    navigate("/assistant", { state: prompt ? { draftPrompt: prompt } : undefined });
  }

  return (
    <PageContainer>
      <section className="hero">
        <div>
          <p className="eyebrow">AI personal tailoring</p>
          <h1>Tell us what you want to wear.</h1>
          <p className="lead">
            PatternX understands your style, budget and deadline, then finds the right
            tailor for you.
          </p>
          <div className="hero__actions">
            <Button variant="primary" onClick={() => goAssistant()}>
              Find My Perfect Tailor
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                saveRequirements(emptyRequirements(), { originalRequest: "" });
                navigate("/recommendations");
              }}
            >
              Explore Tailors
            </Button>
            {!user ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button variant="ghost" onClick={() => navigate("/register")}>
                  Create Account
                </Button>
              </>
            ) : null}
          </div>
        </div>
        <div className="prompt-panel">
          <label>Try a request</label>
          <p>“{DEMO_PROMPT}”</p>
          <Button variant="gold" onClick={() => goAssistant(DEMO_PROMPT)}>
            Use this prompt
          </Button>
        </div>
      </section>

      <section style={{ marginTop: 56 }}>
        <p className="eyebrow">Ateliers on PatternX</p>
        <h2 className="serif" style={{ fontSize: "2rem", marginTop: 8 }}>
          Yangon, Mandalay, and beyond
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 24,
          }}
        >
          {tailors.slice(0, 4).map((t) => (
            <article key={t.id} className="card" style={{ display: "flex", gap: 12 }}>
              <Avatar src={t.profileImage} name={t.name} />
              <div>
                <strong>{t.name}</strong>
                <p style={{ margin: "4px 0", color: "var(--px-muted)", fontSize: "0.9rem" }}>
                  {t.location}
                </p>
                <Badge tone="gold">★ {t.rating}</Badge>
                <p style={{ margin: "8px 0 0", fontSize: "0.85rem" }}>
                  {formatPriceRange(t.priceMin, t.priceMax)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
