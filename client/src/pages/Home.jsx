import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

const ALL_SUBJECTS = ["Mathematics","Physics","Programming","Data Science","AI/ML","Database","Web Development","DSA","English","Calculus","Theory of Automata","Operating Systems","Software Engineering","AI Lab","Computer Networks","Digital Logic Design","Linear Algebra","Statistics","Islamiat","Pakistan Studies"];
const ALL_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIME_SLOTS = ["Morning","Afternoon","Evening"];
const MAX_SUBJECTS = 6;

function Home() {
  usePageTitle("Register");
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", subjects: [], days: [], timeSlot: "", contact: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setChecking(false); return; }
    const myId = JSON.parse(atob(token.split(".")[1])).id;
    axios.get("/api/students")
      .then(res => {
        const myProfile = res.data.data.find(s => s.userId === myId);
        if (myProfile) setExistingProfile(myProfile);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  const toggleItem = (field, value) => {
    if (field === "subjects" && !form.subjects.includes(value) && form.subjects.length >= MAX_SUBJECTS) {
      setErrors(prev => ({ ...prev, subjects: `You can select up to ${MAX_SUBJECTS} subjects only.` }));
      return;
    }
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value]
    }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    else if (form.name.trim().length < 3) errs.name = "Name must be at least 3 characters";
    else if (!/^[a-zA-Z\s]+$/.test(form.name)) errs.name = "Name can only contain letters and spaces";
    if (form.subjects.length === 0) errs.subjects = "Select at least one subject";
    if (form.days.length === 0) errs.days = "Select at least one day";
    if (!form.timeSlot) errs.timeSlot = "Please select a time slot";
    if (form.contact && !/^03[0-9]{9}$/.test(form.contact)) errs.contact = "Enter a valid Pakistani number e.g. 03001234567";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/students", { ...form, name: form.name.trim() }, { headers: { Authorization: `Bearer ${token}` } });
      showToast("You have been registered successfully!");
      setForm({ name: "", subjects: [], days: [], timeSlot: "", contact: "" });
      setErrors({});
      navigate("/students");
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (checking) return <p>Loading...</p>;

  if (existingProfile) {
    return (
      <div>
        <h1>Register as a Study Buddy</h1>
        <p style={{ marginBottom: "1.5rem" }}>You already have a registered profile.</p>
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>✓</p>
          <h2 style={{ marginBottom: "0.5rem" }}>{existingProfile.name}</h2>
          <div style={{ marginBottom: "1rem" }}>
            {existingProfile.subjects.map(s => <span key={s} className="tag">{s}</span>)}
          </div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
            <button onClick={() => navigate(`/edit/${existingProfile._id}`)}>Edit My Profile</button>
            <button onClick={() => navigate("/students")} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}>View All Students</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Register as a Study Buddy</h1>
      <p style={{ marginBottom: "1.5rem" }}>Add your details and find students who study the same subjects at the same time.</p>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name *</label>
            <input type="text" placeholder="Name.." value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: null }); }} />
            {errors.name && <p className="error" style={{ marginTop: "0.3rem" }}>{errors.name}</p>}
          </div>
          <div className="form-group">
            <label>Contact (optional)</label>
            <input type="text" placeholder="e.g. 03001234567" value={form.contact} onChange={e => { setForm({ ...form, contact: e.target.value }); setErrors({ ...errors, contact: null }); }} />
            {errors.contact && <p className="error" style={{ marginTop: "0.3rem" }}>{errors.contact}</p>}
          </div>
          <div className="form-group">
            <label>Subjects you study * (max {MAX_SUBJECTS})</label>
            <div className="checkbox-group">
              {ALL_SUBJECTS.map(s => (
                <label key={s} style={{ opacity: form.subjects.length >= MAX_SUBJECTS && !form.subjects.includes(s) ? 0.5 : 1 }}>
                  <input type="checkbox" checked={form.subjects.includes(s)} onChange={() => toggleItem("subjects", s)} disabled={form.subjects.length >= MAX_SUBJECTS && !form.subjects.includes(s)} />
                  {s}
                </label>
              ))}
            </div>
            {errors.subjects && <p className="error" style={{ marginTop: "0.3rem" }}>{errors.subjects}</p>}
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>{form.subjects.length}/{MAX_SUBJECTS} selected</p>
          </div>
          <div className="form-group">
            <label>Days you are free *</label>
            <div className="checkbox-group">
              {ALL_DAYS.map(d => (
                <label key={d}><input type="checkbox" checked={form.days.includes(d)} onChange={() => toggleItem("days", d)} />{d}</label>
              ))}
            </div>
            {errors.days && <p className="error" style={{ marginTop: "0.3rem" }}>{errors.days}</p>}
          </div>
          <div className="form-group">
            <label>Preferred time slot *</label>
            <select value={form.timeSlot} onChange={e => { setForm({ ...form, timeSlot: e.target.value }); setErrors({ ...errors, timeSlot: null }); }}>
              <option value="">Select a time slot</option>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.timeSlot && <p className="error" style={{ marginTop: "0.3rem" }}>{errors.timeSlot}</p>}
          </div>
          <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </form>
      </div>
    </div>
  );
}

export default Home;
