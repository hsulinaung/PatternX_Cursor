import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Navbar() {
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to={user?.role === "tailor" ? "/tailor/dashboard" : "/"} className="navbar__brand">
        <img src="/images/logo.svg" alt="" />
        PatternX
      </Link>
      <nav className="navbar__links">
        {!ready ? null : !user ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <Link to="/register" className="navbar__cta">
              <span className="btn btn--primary">Get started</span>
            </Link>
          </>
        ) : user.role === "tailor" ? (
          <>
            <span className="navbar__studio-tag">Studio</span>
            <Link to={`/customer/tailor/${user.id}?preview=1`} className="navbar__cta">
              <span className="btn btn--gold">Customer view</span>
            </Link>
            <button type="button" className="nav-text" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/assistant">Assistant</NavLink>
            <NavLink to="/orders">My Orders</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <button type="button" className="nav-text" onClick={onLogout}>
              Logout
            </button>
            <Link to="/assistant" className="navbar__cta">
              <span className="btn btn--primary">Find a tailor</span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
