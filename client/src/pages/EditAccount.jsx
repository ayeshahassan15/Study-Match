import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

function EditAccount() {
  usePageTitle("Edit Account");
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || "", currentPassword: "", newPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    else if (form.name.trim().length < 3) errs.name = "Name must be at least 3 characters";
    else if (!/^[a-zA-Z\s]+$/.test(form.name)) errs.name = "Name can only contain letters and spaces";
    if (form.newPassword && form.newPassword.length < 8) errs.newPassword = "Password must be at least 8 characters";
    if (form.newPassword && !form.currentPassword) errs.currentPassword = "Current password is required to change password";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch("/api/auth/update", form, { headers: { Authorization: `Bearer ${token}` } });
      login(res.data.token, res.data.name);
      setSuccess("Account updated successfully!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Update failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Edit Account</h1>
      <p style={{ marginBottom: "1.5rem" }}>Update your account information</p>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: null }); }} />
            {errors.name && <p className="error" style={{ marginTop: "0.3rem" }}>{errors.name}</p>}
          </div>
          <div className="form-group">
            <label>Current Password (required to change password)</label>
            <input type="password" value={form.currentPassword} onChange={e => { setForm({ ...form, currentPassword: e.target.value }); setErrors({ ...errors, currentPassword: null }); }} />
            {errors.currentPassword && <p className="error" style={{ marginTop: "0.3rem" }}>{errors.currentPassword}</p>}
          </div>
          <div className="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input type="password" value={form.newPassword} onChange={e => { setForm({ ...form, newPassword: e.target.value }); setErrors({ ...errors, newPassword: null }); }} />
            {errors.newPassword && <p className="error" style={{ marginTop: "0.3rem" }}>{errors.newPassword}</p>}
          </div>
          {errors.general && <p className="error">{errors.general}</p>}
          {success && <p className="success">{success}</p>}
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
            <button type="button" onClick={() => navigate("/profile")} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAccount;