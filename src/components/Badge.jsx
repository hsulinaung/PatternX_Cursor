export default function Badge({ children, tone = "default" }) {
  const extra = tone !== "default" ? ` badge--${tone}` : "";
  return <span className={`badge${extra}`}>{children}</span>;
}
