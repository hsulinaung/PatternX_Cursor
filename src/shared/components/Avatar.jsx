import { initials } from "../utils/format";

export default function Avatar({ src, name = "", size = "md" }) {
  const cls = size === "lg" ? "avatar avatar--lg" : "avatar";
  if (src) {
    return <img className={cls} src={src} alt={name} />;
  }
  return (
    <div className={cls} aria-hidden="true">
      {initials(name)}
    </div>
  );
}
