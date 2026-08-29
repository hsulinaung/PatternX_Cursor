import { useAuth } from "../AuthContext";
import PageContainer from "../../shared/components/PageContainer";
import Card from "../../shared/components/Card";
import Avatar from "../../shared/components/Avatar";
import Badge from "../../shared/components/Badge";
import "../auth.css";

export default function CustomerProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <PageContainer className="auth-page">
      <p className="eyebrow">Your account</p>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Avatar src={user.profileImage} name={user.name} size="lg" />
        <div>
          <h1 className="serif" style={{ margin: 0 }}>
            {user.name}
          </h1>
          <Badge>Customer</Badge>
        </div>
      </div>
      <Card className="req-card">
        <dl className="req-grid">
          <div>
            <dt>Email</dt>
            <dd>{user.email || "—"}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{user.phone || "—"}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{user.location || "—"}</dd>
          </div>
          <div>
            <dt>Account type</dt>
            <dd>Customer</dd>
          </div>
        </dl>
      </Card>
    </PageContainer>
  );
}
