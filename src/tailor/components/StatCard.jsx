import Card from "../../shared/components/Card";

export default function StatCard({ label, value }) {
  return (
    <Card className="stat-card">
      <p className="eyebrow">{label}</p>
      <p className="stat-card__value">{value}</p>
    </Card>
  );
}
