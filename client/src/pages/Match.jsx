import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import usePageTitle from "../hooks/usePageTitle";

const ALL_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIME_SLOTS = ["Morning","Afternoon","Evening"];
const ALL_SUBJECTS = ["Mathematics","Physics","Programming","Data Science","AI/ML","Database","Web Development","DSA","English","Calculus","Theory of Automata","Operating Systems","Software Engineering","AI Lab","Computer Networks","Digital Logic Design","Linear Algebra","Statistics","Islamiat","Pakistan Studies"];

function Match() {
  usePageTitle("Find Match");
  const [filters, setFilters] = useState({ subjects: [], day: "", timeSlot: "" });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getMyId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch { return null; }
  };

  const toggleSubject = (subject) => {
    setFilters(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
    setError(null);
  };

  const calcMatchPercent = (student) => {
    let score = 0;
    let total = 0;
    if (filters.subjects.length > 0) {
      total += 60;
      const matchedSubjects = filters.subjects.filter(s => student.subjects.includes(s));
      score += (matchedSubjects.length / filters.subjects.length) * 60;
    }
    if (filters.day) {
      total += 20;
      if (student.days.includes(filters.day)) score += 20;
    }
    if (filters.timeSlot) {
      total += 20;
      if (student.timeSlot === filters.timeSlot) score += 20;
    }
    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  const handleSearch = async () => {
    if (filters.subjects.length === 0 && !filters.day && !filters.timeSlot) {
      setError("Please select at least one filter before searching.");
      return;
    }
    setError(null);
    setLoading(true);
    setSearched(false);
    try {
      const myId = getMyId();
      const res = await axios.get("/api/students");
      let data = res.data.data;
      data = data.filter(s => !s.userId || s.userId !== myId);
      if (filters.subjects.length > 0) data = data.filter(s => s.subjects.some(sub => filters.subjects.includes(sub)));
      if (filters.day) data = data.filter(s => s.days.includes(filters.day));
      if (filters.timeSlot) data = data.filter(s => s.timeSlot === filters.timeSlot);
      data = data.map(s => ({ ...s, matchPercent: calcMatchPercent(s) }));
      data.sort((a, b) => b.matchPercent - a.matchPercent);
      setResults(data);
      setSearched(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({ subjects: [], day: "", timeSlot: "" });
    setResults([]);
    setSearched(false);
    setError(null);
  };

  return (
    <div>
      <h1>Find a Study Buddy</h1>
      <p style={{ marginBottom: "1.5rem" }}>Filter by subject, day, or time to find students with matching availability.</p>

      <div className="card">
        <div className="form-group">
          <label>Subjects (select one or more)</label>
          <div className="checkbox-group">
            {ALL_SUBJECTS.map(s => (
              <label key={s}>
                <input type="checkbox" checked={filters.subjects.includes(s)} onChange={() => toggleSubject(s)} />
                {s}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Day</label>
          <select value={filters.day} onChange={e => { setFilters({ ...filters, day: e.target.value }); setError(null); }}>
            <option value="">Any day</option>
            {ALL_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Time Slot</label>
          <select value={filters.timeSlot} onChange={e => { setFilters({ ...filters, timeSlot: e.target.value }); setError(null); }}>
            <option value="">Any time</option>
            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {error && <p className="error">{error}</p>}
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={handleSearch} disabled={loading}>{loading ? "Searching..." : "Search"}</button>
          <button onClick={handleReset} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}>Reset</button>
        </div>
      </div>

      {!searched && !loading && (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <p className="empty">Use the filters above to find your perfect study buddy!</p>
        </div>
      )}

      {loading && <Spinner />}

      {searched && !loading && (
        <>
          <h2 style={{ margin: "1.5rem 0 1rem" }}>{results.length} match{results.length !== 1 ? "es" : ""} found</h2>
          {results.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <p className="empty">No matches found. Try different filters.</p>
            </div>
          )}
          {results.map(student => (
            <div key={student._id} className="card" style={{ cursor: "pointer" }} onClick={() => navigate(`/student/${student._id}`)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: "0.4rem" }}>{student.name}</h3>
                  <div style={{ marginBottom: "0.5rem" }}>
                    {student.subjects.map(s => <span key={s} className="tag" style={{ background: filters.subjects.includes(s) ? "rgba(124,109,255,0.3)" : undefined }}>{s}</span>)}
                  </div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    {student.days.map(d => <span key={d} className="tag day" style={{ background: d === filters.day ? "rgba(255,109,176,0.3)" : undefined }}>{d}</span>)}
                  </div>
                  <span className="tag time">{student.timeSlot}</span>
                </div>
                <div style={{ textAlign: "center", minWidth: "60px" }}>
                  <div style={{ fontSize: "1.4rem", fontWeight: "700", color: student.matchPercent >= 70 ? "var(--success)" : student.matchPercent >= 40 ? "#f59e0b" : "var(--text-muted)" }}>
                    {student.matchPercent}%
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>match</div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Match;
