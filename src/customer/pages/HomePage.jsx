import { Navigate, useNavigate } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import { DEMO_PROMPT, tailors } from "../../shared/data/tailors";
import Avatar from "../../shared/components/Avatar";
import Badge from "../../shared/components/Badge";
import { formatCompletion, formatPriceRange } from "../../shared/utils/format";
import { emptyRequirements } from "../../shared/utils/requirementParser";
import { saveRequirements } from "../../services/journeyService";
import { useAuth } from "../../auth/AuthContext";

function AtelierStrip({ navigate }) {
  const featured = tailors.slice(0, 4);
  return (
    <section className="landing-ateliers-wrap">
      <p className="eyebrow">Four ateliers on PatternX</p>
      <h2 className="serif" style={{ fontSize: "2rem", marginTop: 8 }}>
        Meet the tailors
      </h2>
      <p className="muted" style={{ maxWidth: "40rem" }}>
        A small, curated set — so you can see the work, the lead cutter, and what each studio is known for.
      </p>
      <div className="landing-ateliers">
        {featured.map((t) => (
          <article key={t.id} className="card landing-atelier-card">
            <img className="landing-atelier-card__photo" src={t.profileImage} alt={t.name} />
            <div className="landing-atelier-card__body">
              <div className="landing-atelier-card__top">
                <Avatar src={t.profileImage} name={t.name} />
                <div>
                  <h3 className="serif" style={{ margin: 0 }}>{t.name}</h3>
                  <p className="muted" style={{ margin: "4px 0 0" }}>{t.location}</p>
                </div>
              </div>
              <div className="landing-atelier-card__meta">
                <Badge tone="gold">★ {t.rating} · {t.reviewCount} reviews</Badge>
                <Badge tone={t.available ? "success" : "default"}>
                  {t.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <p>{t.description}</p>
              {t.highlight ? <p className="landing-atelier-card__highlight">{t.highlight}</p> : null}
              <dl className="landing-atelier-card__facts">
                {t.ownerName ? (
                  <div>
                    <dt>Lead tailor</dt>
                    <dd>{t.ownerName}</dd>
                  </div>
                ) : null}
                {t.yearsExperience ? (
                  <div>
                    <dt>Experience</dt>
                    <dd>{t.yearsExperience} years</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Specialties</dt>
                  <dd>{t.specialties.join(" · ")}</dd>
                </div>
                <div>
                  <dt>Style</dt>
                  <dd>{t.styles.join(" · ")}</dd>
                </div>
                <div>
                  <dt>Price</dt>
                  <dd>{formatPriceRange(t.priceMin, t.priceMax)}</dd>
                </div>
                <div>
                  <dt>Turnaround</dt>
                  <dd>{formatCompletion(t.completionDays)}</dd>
                </div>
                {t.hours ? (
                  <div>
                    <dt>Hours</dt>
                    <dd>{t.hours}</dd>
                  </div>
                ) : null}
                {t.languages ? (
                  <div>
                    <dt>Languages</dt>
                    <dd>{t.languages.join(", ")}</dd>
                  </div>
                ) : null}
              </dl>
              {t.sampleImages?.length ? (
                <div className="landing-atelier-card__samples">
                  {t.sampleImages.map((src) => (
                    <img key={src} src={src} alt={`Work from ${t.name}`} />
                  ))}
                </div>
              ) : null}
              <Button variant="secondary" onClick={() => navigate(`/tailor/${t.id}`)}>
                View atelier
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CustomerHome({ navigate }) {
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
            PatternX understands your style, budget and deadline, then finds the right tailor for
            you.
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
      <AtelierStrip navigate={navigate} />
    </PageContainer>
  );
}

function GuestLanding({ navigate }) {
  return (
    <PageContainer className="landing-page">
      <section className="hero hero--landing">
        <div>
          <p className="eyebrow">Myanmar digital tailoring</p>
          <h1>Custom clothing, connected.</h1>
          <p className="lead">
            PatternX is a shared studio for customers and tailors. Describe what you want to wear,
            or grow your atelier with incoming requests, quotes, and orders — in one place.
          </p>
          <div className="hero__actions">
            <Button variant="primary" onClick={() => navigate("/register/customer")}>
              I&apos;m a Customer
            </Button>
            <Button variant="secondary" onClick={() => navigate("/register/tailor")}>
              I&apos;m a Tailor
            </Button>
          </div>
        </div>
        <div className="prompt-panel">
          <label>One platform</label>
          <p>Customers find the right atelier. Tailors receive the work and keep it moving.</p>
          <Button variant="gold" onClick={() => navigate("/register")}>
            Create an account
          </Button>
        </div>
      </section>

      <section className="landing-paths" aria-label="Choose your path">
        <Card id="for-customers" className="landing-path">
          <p className="eyebrow">For customers</p>
          <h2 className="serif">Find the right tailor</h2>
          <p className="muted">
            Tell PatternX what you want to wear. The assistant reads style, budget, and deadline,
            then recommends ateliers. Customize the piece, add measurements if you like, and send
            the order.
          </p>
          <ul className="landing-steps">
            <li>Describe the piece in your own words</li>
            <li>Compare recommended ateliers</li>
            <li>Customize, measure, and confirm</li>
          </ul>
          <div className="hero__actions">
            <Button variant="primary" onClick={() => navigate("/register/customer")}>
              Create Customer Account
            </Button>
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Customer login
            </Button>
          </div>
        </Card>
        <Card id="for-tailors" className="landing-path">
          <p className="eyebrow">For tailors</p>
          <h2 className="serif">Grow your atelier</h2>
          <p className="muted">
            Open a PatternX studio to receive customer requests, send quotes, and update order
            status. Customers see your progress. You stay in control of the work.
          </p>
          <ul className="landing-steps">
            <li>Receive matched customer requests</li>
            <li>Accept, quote, and note the brief</li>
            <li>Move orders from confirmed to complete</li>
          </ul>
          <div className="hero__actions">
            <Button variant="secondary" onClick={() => navigate("/register/tailor")}>
              Join as a Tailor
            </Button>
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Tailor login
            </Button>
          </div>
        </Card>
      </section>

      <AtelierStrip navigate={navigate} />
    </PageContainer>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user?.role === "tailor") {
    return <Navigate to="/tailor/dashboard" replace />;
  }

  if (user?.role === "customer") {
    return <CustomerHome navigate={navigate} />;
  }

  return <GuestLanding navigate={navigate} />;
}
