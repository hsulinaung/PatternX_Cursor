import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        <img src="/images/logo.svg" alt="" />
        PatternX
      </Link>
      <nav className="navbar__links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/assistant">Assistant</NavLink>
        <NavLink to="/recommendations">Tailors</NavLink>
        <NavLink to="/orders">Orders</NavLink>
        <Link to="/assistant" className="navbar__cta">
          <span className="btn btn--primary">Find a tailor</span>
        </Link>
      </nav>
    </header>
  );
}
