import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "../../shared/components/Avatar";
import { getPublicTailor } from "../../shared/data/tailors";
import { getActingTailor } from "../../auth/activeIdentity";

const LINKS = [
  {
    to: "/tailor/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="1.5" />
        <rect x="13" y="10" width="8" height="11" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
      </svg>
    ),
  },
  {
    to: "/tailor/requests",
    label: "Requests",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 5h14v14H5z" />
        <path d="M8 9h8M8 12h8M8 15h5" />
      </svg>
    ),
  },
  {
    to: "/tailor/orders",
    label: "Orders",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16l-1.2 11H5.2z" />
        <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
      </svg>
    ),
  },
  {
    to: "/tailor/profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 19c1.4-3.2 3.8-4.8 7-4.8s5.6 1.6 7 4.8" />
      </svg>
    ),
  },
];

export default function StudioNav() {
  const navigate = useNavigate();
  const studio = getActingTailor();
  const profile = getPublicTailor(studio.id);

  return (
    <aside className="studio-nav">
      <div className="studio-nav__brand">
        <Avatar src={profile?.profileImage} name={studio.name} />
        <div>
          <p className="eyebrow">Atelier</p>
          <strong>{studio.name}</strong>
          <p className="studio-nav__place">{profile?.location || "PatternX studio"}</p>
        </div>
      </div>
      <nav>
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === "/tailor/dashboard"}>
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        className="studio-nav__preview"
        onClick={() => navigate(`/customer/tailor/${studio.id}?preview=1`)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2.5 12s3.8-6.5 9.5-6.5S21.5 12 21.5 12s-3.8 6.5-9.5 6.5S2.5 12 2.5 12z" />
          <circle cx="12" cy="12" r="2.4" />
        </svg>
        Customer view
      </button>
    </aside>
  );
}
