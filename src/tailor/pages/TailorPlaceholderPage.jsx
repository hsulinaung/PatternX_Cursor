import { Link } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Button from "../../shared/components/Button";

export default function TailorPlaceholderPage({ title, note }) {
  return (
    <PageContainer className="placeholder-page">
      <p className="eyebrow">Tailor studio</p>
      <h1>{title}</h1>
      <p>{note || "This tailor workspace screen is reserved for Developer 2. Features are not implemented yet."}</p>
      <p style={{ marginTop: 24 }}>
        <Link to="/tailor">
          <Button variant="secondary">Back to tailor home</Button>
        </Link>
      </p>
    </PageContainer>
  );
}
