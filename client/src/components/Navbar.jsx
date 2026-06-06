import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <span className="brand">Study Match</span>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "?" : "?"}
      </button>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {user ? (
          <>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>Register</NavLink>
            <NavLink to="/students" onClick={() => setMenuOpen(false)}>All Students</NavLink>
            <NavLink to="/match" onClick={() => setMenuOpen(false)}>Find Match</NavLink>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={() => setMenuOpen(false)}>Log In</NavLink>
            <NavLink to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
