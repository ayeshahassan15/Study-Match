import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { email: form.email.trim(), password: form.password });
      login(res.data.token, res.data.name);
      navigate("/");
    } catch (err) {
      setStatus(err.response?.data?.message || "Something went wrong");
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
            <input type="text" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
            {errors.email && <p className="error" style={{ marginTop: "0.3rem" }}>{errors.email}</p>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} name="password" placeholder="your password" value={form.password} onChange={handleChange} style={{ paddingRight: "3rem" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "0.7rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.8rem", padding: 0, cursor: "pointer" }}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="error" style={{ marginTop: "0.3rem" }}>{errors.password}</p>}
          </div>
          {status && <p className="error">{status}</p>}
          <button type="submit" disabled={loading} style={{ width: "100%", marginTop: "0.5rem" }}>{loading ? "Logging in..." : "Log In"}</button>
          <p style={{ marginTop: "1rem", fontSize: "0.88rem" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "var(--accent)" }}>Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
