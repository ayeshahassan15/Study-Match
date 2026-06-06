import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentCard from "../components/StudentCard";

const ALL_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIME_SLOTS = ["Morning","Afternoon","Evening"];

function Match() {
  const [filters, setFilters] = useState({ subject: "", day: "", timeSlot: "" });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!filters.subject.trim() && !filters.day && !filters.timeSlot) {
      setError("Please select at least one filter before searching.");
      return;
    }
    setError(null);
    setLoading(true);
    setSearched(false);
    try {
      const params = {};
      if (filters.subject.trim()) params.subject = filters.subject.trim();
      if (filters.day) params.day = filters.day;
      if (filters.timeSlot) params.timeSlot = filters.timeSlot;
      const res = await axios.get("/api/students", { params: { ...params, match: true } });
      setResults(res.data.data);
      setSearched(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({ subject: "", day: "", timeSlot: "" });
    setResults([]);
    setSearched(false);
    setError(null);
  };

  const handleDelete = (id) => {
    setResults((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <div>
      <h1>Find a Study Buddy</h1>
      <p style={{ marginBottom: "1.5rem" }}>Filter by subject, day, or time to find students with matching availability.</p>
      <div className="card">
        <div className="form-group">
          <label>Subject</label>
          <input type="text" placeholder="e.g. Mathematics, DSA, AI/ML" value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Day</label>
          <select value={filters.day} onChange={(e) => setFilters({ ...filters, day: e.target.value })}>
            <option value="">Any day</option>
            {ALL_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Time Slot</label>
          <select value={filters.timeSlot} onChange={(e) => setFilters({ ...filters, timeSlot: e.target.value })}>
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

      {searched && !loading && (
        <>
          <h2 style={{ margin: "1.5rem 0 1rem" }}>{results.length} match{results.length !== 1 ? "es" : ""} found</h2>
          {results.length === 0 && <p className="empty">No matches found. Try different filters.</p>}
          {results.map(student => (
            <StudentCard key={student._id} student={student} onDelete={handleDelete} onView={() => navigate(`/student/${student._id}`)} onEdit={() => navigate(`/edit/${student._id}`)} />
          ))}
        </>
      )}
    </div>
  );
}

export default Match;
