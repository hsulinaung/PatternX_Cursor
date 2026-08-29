import Button from "./Button";

export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty">
      <h2 className="serif">{title}</h2>
      <p>{message}</p>
      {actionLabel && onAction ? (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
