import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import PageContainer from "../../shared/components/PageContainer";
import Card from "../../shared/components/Card";
import Avatar from "../../shared/components/Avatar";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import MeasurementList from "../../shared/components/MeasurementList";
import { getMeasurementProfile } from "../../services/measurementService";
import { sourceLabel } from "../../shared/utils/measurements";
import "../auth.css";

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  const profile = getMeasurementProfile(user.id);

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
      <Card className="req-card">
        <h2 className="serif" style={{ marginTop: 0 }}>
          My Measurements
        </h2>
        {profile ? (
          <>
            <p className="muted">
              Latest update {new Date(profile.updatedAt).toLocaleString()} · {sourceLabel(profile.source)}
            </p>
            <MeasurementList measurements={profile.measurements} source={profile.source} title="Saved profile" />
          </>
        ) : (
          <p className="muted">No saved measurements yet. Add them from customization or enter them here.</p>
        )}
        <Button variant="primary" onClick={() => navigate("/measurements?from=profile")}>
          View / Edit Measurements
        </Button>
      </Card>
    </PageContainer>
  );
}
