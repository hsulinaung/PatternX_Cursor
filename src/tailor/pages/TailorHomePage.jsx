import { Link } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Button from "../../shared/components/Button";

export default function TailorHomePage() {
  return (
    <PageContainer>
      <p className="eyebrow">For ateliers</p>
      <h1 className="serif" style={{ fontSize: "2.6rem" }}>
        Tailor studio
      </h1>
      <p style={{ color: "var(--px-muted)", maxWidth: 480 }}>
        Demo entry for PatternX tailors. No login yet — Developer 2 will build incoming
        requests, quotes, and order status here.
      </p>
      <div className="hero__actions">
        <Link to="/tailor/dashboard">
          <Button variant="primary">Open dashboard</Button>
        </Link>
        <Link to="/demo">
          <Button variant="secondary">Back to demo chooser</Button>
        </Link>
      </div>
    </PageContainer>
  );
}
