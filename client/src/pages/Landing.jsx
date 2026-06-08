import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

function Landing() {
  usePageTitle("Welcome");
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Study Match</h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "var(--text-muted)" }}>
        Find the perfect study buddy based on your subjects, availability, and time slot.
      </p>
      <p style={{ marginBottom: "2.5rem", color: "var(--text-muted)" }}>
        Connect with students from your university, join study groups, and never study alone again.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link to="/signup"><button style={{ padding: "0.8rem 2rem", fontSize: "1rem" }}>Get Started</button></Link>
        <Link to="/login"><button style={{ padding: "0.8rem 2rem", fontSize: "1rem", background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}>Log In</button></Link>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "4rem", flexWrap: "wrap" }}>
        <div className="card" style={{ maxWidth: "200px", textAlign: "center" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Register</h2>
          <p>Add your subjects and availability to get started.</p>
        </div>
        <div className="card" style={{ maxWidth: "200px", textAlign: "center" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Match</h2>
          <p>Find students with the same subjects and free time.</p>
        </div>
        <div className="card" style={{ maxWidth: "200px", textAlign: "center" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Connect</h2>
          <p>Send connection requests and study together.</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;