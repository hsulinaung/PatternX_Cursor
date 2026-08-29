import { MEASUREMENT_FIELDS } from "../../shared/utils/measurements";

export default function MeasurementEditor({ values, errors, onChange, estimated }) {
  return (
    <div className="req-form">
      {MEASUREMENT_FIELDS.map((field) => (
        <label key={field.key}>
          {field.label}
          <span className="measure-input">
            <input
              type="number"
              min={field.min}
              max={field.max}
              step="1"
              value={values[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
            <em>cm</em>
          </span>
          {estimated ? <small className="muted">Estimated</small> : null}
          {errors[field.key] ? <small className="form-error">{errors[field.key]}</small> : null}
        </label>
      ))}
    </div>
  );
}
