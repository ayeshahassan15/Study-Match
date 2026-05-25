import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <span className="brand">Study Match</span>
      <div className="nav-links">
        <NavLink to="/" end>Register</NavLink>
        <NavLink to="/students">All Students</NavLink>
        <NavLink to="/match">Find Match</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
