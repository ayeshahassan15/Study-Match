import { useState } from "react";
import axios from "axios";

const ALL_SUBJECTS = ["Mathematics", "Physics", "Programming", "Data Science", "AI/ML", "Database", "Web Development", "DSA", "English", "Calculus"];
const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = ["Morning", "Afternoon", "Evening"];

function Home() {
  const [form, setForm] = useState({
    name: "",
    subjects: [],
    days: [],
    timeSlot: "",
    contact: "",
  });
  const [status, setStatus] = useState(null);

  const toggleItem = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!form.name || form.subjects.length === 0 || form.days.length === 0 || !form.timeSlot) {
      setStatus({ type: "error", msg: "Please fill in all required fields." });
      return;
    }

    try {
     await axios.post("https://study-match-zeta.vercel.app/api/students", form);
      setStatus({ type: "success", msg: "You have been registered successfully!" });
      setForm({ name: "", subjects: [], days: [], timeSlot: "", contact: "" });
    } catch (err) {
      setStatus({ type: "error", msg: "Something went wrong. Please try again." });
    }
  };

  return (
    <div>
      <h1>Register as a Study Buddy</h1>
      <p style={{ marginBottom: "1.5rem" }}>Add your details and find students who study the same subjects at the same time.</p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name *</label>
            <input
              type="text"
              placeholder="Name.."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Contact (optional)</label>
            <input
              type="text"
              placeholder="e.g. email or WhatsApp number"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Subjects you study *</label>
            <div className="checkbox-group">
              {ALL_SUBJECTS.map((s) => (
                <label key={s}>
                  <input
                    type="checkbox"
                    checked={form.subjects.includes(s)}
                    onChange={() => toggleItem("subjects", s)}
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Days you are free *</label>
            <div className="checkbox-group">
              {ALL_DAYS.map((d) => (
                <label key={d}>
                  <input
                    type="checkbox"
                    checked={form.days.includes(d)}
                    onChange={() => toggleItem("days", d)}
                  />
                  {d}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Preferred time slot *</label>
            <select
              value={form.timeSlot}
              onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
            >
              <option value="">Select a time slot</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button type="submit">Register</button>

          {status && (
            <p className={status.type} style={{ marginTop: "0.8rem" }}>
              {status.msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Home;
