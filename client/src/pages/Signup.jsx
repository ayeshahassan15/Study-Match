import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const API = "https://study-match-lemon.vercel.app";
function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/register`, form);
      login(res.data.token, res.data.name);
      navigate("/");
    } catch (err) {
      setStatus(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create an account</h1>
      <p style={{ marginBottom: "1.5rem" }}>Join and find students to study with</p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="min 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {status && <p className="error">{status}</p>}

          <p style={{ marginTop: "1rem", fontSize: "0.88rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent)" }}>
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;