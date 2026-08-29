import { Link } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";
import "../auth.css";

export default function RegisterChoicePage() {
  return (
    <PageContainer className="auth-page">
      <p className="eyebrow">Get started</p>
      <h1 className="serif">Join PatternX</h1>
      <p className="muted">Choose how you want to use the platform.</p>
      <div className="auth-choice">
        <Card>
          <p className="eyebrow">Customer</p>
          <h2 className="serif">Find the right tailor</h2>
          <p>Find the right tailor for what you want to wear.</p>
          <Link to="/register/customer">
            <Button variant="primary">Create Customer Account</Button>
          </Link>
        </Card>
        <Card>
          <p className="eyebrow">Tailor</p>
          <h2 className="serif">Grow your atelier</h2>
          <p>Grow your tailoring business and receive customers through PatternX.</p>
          <Link to="/register/tailor">
            <Button variant="secondary">Join as a Tailor</Button>
          </Link>
        </Card>
      </div>
    </PageContainer>
  );
}
