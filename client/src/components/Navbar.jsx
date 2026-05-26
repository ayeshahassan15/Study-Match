import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <span className="brand">Study Match</span>
      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/" end>Register</NavLink>
            <NavLink to="/students">All Students</NavLink>
            <NavLink to="/match">Find Match</NavLink>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log In</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;