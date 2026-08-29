import { MEASUREMENT_FIELDS, sourceLabel } from "../utils/measurements";

export default function MeasurementList({ measurements, source, title = "Customer measurements" }) {
  if (!measurements) return null;
  return (
    <section className="measure-block">
      <h3 className="serif" style={{ marginBottom: 6 }}>
        {title}
      </h3>
      {source ? (
        <p className="muted">
          {source === "camera-estimate"
            ? "Customer-provided / AI-estimated measurements"
            : "Customer-provided measurements"}{" "}
          · {sourceLabel(source)}
        </p>
      ) : null}
      <dl className="req-grid">
        {MEASUREMENT_FIELDS.map((field) => (
          <div key={field.key}>
            <dt>{field.label}</dt>
            <dd>{measurements[field.key] != null ? `${measurements[field.key]} cm` : "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
