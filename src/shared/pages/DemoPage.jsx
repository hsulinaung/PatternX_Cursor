import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import Button from "../components/Button";

export default function DemoPage() {
  return (
    <PageContainer>
      <p className="eyebrow">PatternX workspace</p>
      <h1 className="serif" style={{ fontSize: "2.8rem" }}>
        Continue the demo
      </h1>
      <p style={{ color: "var(--px-muted)", maxWidth: 520 }}>
        One application, two experiences. Customer and tailor teams share services and
        data, and work in separate feature folders.
      </p>
      <div className="hero__actions">
        <Link to="/">
          <Button variant="primary">Continue as Customer</Button>
        </Link>
        <Link to="/tailor">
          <Button variant="secondary">Continue as Tailor</Button>
        </Link>
      </div>
    </PageContainer>
  );
}
