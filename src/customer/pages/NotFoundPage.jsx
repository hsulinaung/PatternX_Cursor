import { Link } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Button from "../../shared/components/Button";

export default function NotFoundPage() {
  return (
    <PageContainer className="not-found">
      <p className="eyebrow">404</p>
      <h1>This page is not on the pattern.</h1>
      <p style={{ color: "var(--px-muted)" }}>Return home or speak with the assistant.</p>
      <p style={{ marginTop: 24 }}>
        <Link to="/">
          <Button variant="primary">Back to PatternX</Button>
        </Link>
      </p>
    </PageContainer>
  );
}
