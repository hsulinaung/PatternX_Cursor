export default function LoadingState({ label = "PatternX is thinking…" }) {
  return (
    <div className="loading" role="status">
      <div>
        <span className="loading__dot" />
        <span className="loading__dot" />
        <span className="loading__dot" />
      </div>
      <p>{label}</p>
    </div>
  );
}
