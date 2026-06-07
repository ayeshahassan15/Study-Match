import { useState, useEffect, useRef  } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);

const navRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (navRef.current && !navRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

 useEffect(() => {
    if (!user) return;
    const fetchUnread = () => {
      const token = localStorage.getItem("token");
      axios.get("/api/connections", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          const notifs = res.data.data.notifications || [];
          setUnread(notifs.filter(n => !n.read).length + (res.data.data.requests?.length || 0));
        })
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    
<nav className="navbar" ref={navRef}>
      <NavLink to="/" className="brand">Study Match</NavLink>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button onClick={toggleTheme} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text)", padding: "0.3rem 0.6rem", fontSize: "1rem", borderRadius: "8px" }}>
  {theme === "dark" ? "🌙" : "☀️"}
</button>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
  {menuOpen ? "✕" : "☰"}
</button>
      </div>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {user ? (
          <>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>Register</NavLink>
            <NavLink to="/students" onClick={() => setMenuOpen(false)}>Students</NavLink>
            <NavLink to="/match" onClick={() => setMenuOpen(false)}>Find Match</NavLink>
            <NavLink to="/groups" onClick={() => setMenuOpen(false)}>Groups</NavLink>
            <NavLink to="/connections" onClick={() => setMenuOpen(false)} style={{ position: "relative" }}>
              Connections
              {unread > 0 && (
                <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "var(--error)", color: "white", borderRadius: "50%", fontSize: "0.65rem", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {unread}
                </span>
              )}
            </NavLink>
            <NavLink to="/profile" onClick={() => setMenuOpen(false)}>My Profile</NavLink>
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



