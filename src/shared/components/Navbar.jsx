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
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Create Account</NavLink>
            <Link to="/assistant" className="navbar__cta">
              <span className="btn btn--primary">Find a tailor</span>
            </Link>
          </>
        ) : user.role === "tailor" ? (
          <>
            <NavLink to="/tailor/dashboard">Tailor Studio</NavLink>
            <NavLink to="/tailor/profile">Profile</NavLink>
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
