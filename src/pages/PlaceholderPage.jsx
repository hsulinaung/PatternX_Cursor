import PageContainer from "../components/PageContainer";
import Button from "../components/Button";
import { Link } from "react-router-dom";

export default function PlaceholderPage({ title, note, nextTo, nextLabel }) {
  return (
    <PageContainer className="placeholder-page">
      <p className="eyebrow">Coming in the next phase</p>
      <h1>{title}</h1>
      <p>{note}</p>
      {nextTo ? (
        <p style={{ marginTop: 24 }}>
          <Link to={nextTo}>
            <Button variant="secondary">{nextLabel || "Continue"}</Button>
          </Link>
        </p>
      ) : null}
    </PageContainer>
  );
}
