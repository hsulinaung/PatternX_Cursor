import { NavLink, Link } from "react-router-dom";
import { getActingTailor } from "../../auth/activeIdentity";

export default function StudioNav() {
  const studio = getActingTailor();
  return (
    <aside className="studio-nav">
      <p className="eyebrow">Tailor Studio</p>
      <strong>{studio.name}</strong>
      <nav>
        <NavLink to="/tailor/dashboard">Dashboard</NavLink>
        <NavLink to="/tailor/requests">Requests</NavLink>
        <NavLink to="/tailor/orders">Orders</NavLink>
        <NavLink to="/tailor/profile">Profile</NavLink>
      </nav>
      <Link to="/" className="studio-nav__customer">
        Customer View
      </Link>
    </aside>
  );
}
