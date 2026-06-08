import usePageTitle from "../hooks/usePageTitle";
import PageWrapper from "../components/PageWrapper";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  usePageTitle("Sign Up");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    else if (form.name.trim().length < 3) errs.name = "Name must be at least 3 characters";
    else if (!/^[a-zA-Z\s]+$/.test(form.name)) errs.name = "Name can only contain letters and spaces";

    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";

    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
    else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(form.password)) errs.password = "Password must have uppercase, lowercase and a number";

    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";

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
      const res = await axios.post("/api/auth/register", { name: form.name.trim(), email: form.email.trim(), password: form.password });
      login(res.data.token, res.data.name, res.data.badges || []);
      navigate("/register");
    } catch (err) {
      setStatus(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Weak", color: "var(--error)" };
    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(p)) return { label: "Medium", color: "#f59e0b" };
    return { label: "Strong", color: "var(--success)" };
  };

  const strength = getPasswordStrength();

  return (
    <PageWrapper>
      <div>
      <h1>Create an account</h1>
      <p style={{ marginBottom: "1.5rem" }}>Join and find students to study with</p>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
            {errors.name && <p className="error" style={{ marginTop: "0.3rem" }}>{errors.name}</p>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="text" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
            {errors.email && <p className="error" style={{ marginTop: "0.3rem" }}>{errors.email}</p>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} name="password" placeholder="min 8 characters" value={form.password} onChange={handleChange} style={{ paddingRight: "3rem" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "0.7rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.8rem", padding: 0, cursor: "pointer" }}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {strength && <p style={{ marginTop: "0.3rem", fontSize: "0.8rem", color: strength.color }}>Password strength: {strength.label}</p>}
            {errors.password && <p className="error" style={{ marginTop: "0.3rem" }}>{errors.password}</p>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="repeat your password" value={form.confirmPassword} onChange={handleChange} style={{ paddingRight: "3rem" }} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: "0.7rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.8rem", padding: 0, cursor: "pointer" }}>
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && <p className="error" style={{ marginTop: "0.3rem" }}>{errors.confirmPassword}</p>}
          </div>
          {status && <p className="error">{status}</p>}
          <button type="submit" disabled={loading} style={{ width: "100%", marginTop: "0.5rem" }}>{loading ? "Creating account..." : "Sign Up"}</button>
          <p style={{ marginTop: "1rem", fontSize: "0.88rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent)" }}>Log in</Link>
          </p>
        </form>
      </div>
    </div>
    </PageWrapper>
  );
}
export default Signup;








