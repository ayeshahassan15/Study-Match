import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const API = "https://study-match-lemon.vercel.app";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/login`, form);
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
      <h1>Welcome back</h1>
      <p style={{ marginBottom: "1.5rem" }}>Log in to find your study buddy</p>

      <div className="card">
        <form onSubmit={handleSubmit}>
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
              placeholder="your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>

          {status && <p className="error">{status}</p>}

          <p style={{ marginTop: "1rem", fontSize: "0.88rem" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "var(--accent)" }}>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;