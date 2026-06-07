import usePageTitle from "../hooks/usePageTitle";
import PageWrapper from "../components/PageWrapper";
import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import StudentCard from "../components/StudentCard";
import Spinner from "../components/Spinner";
import PageWrapper from "../components/PageWrapper";

const ALL_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIME_SLOTS = ["Morning","Afternoon","Evening"];

function Match() {
  usePageTitle("Find Match");
  const [filters, setFilters] = useState({ subject: "", day: "", timeSlot: "" });
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

  const handleSearch = async () => {
    if (!filters.subject.trim() && !filters.day && !filters.timeSlot) {
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
      if (filters.subject.trim()) data = data.filter(s => s.subjects.some(sub => sub.toLowerCase().includes(filters.subject.toLowerCase())));
      if (filters.day) data = data.filter(s => s.days.includes(filters.day));
      if (filters.timeSlot) data = data.filter(s => s.timeSlot === filters.timeSlot);
      setResults(data);
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

  return (
    <PageWrapper>
      <div>
      <h1>Find a Study Buddy</h1>
      <p style={{ marginBottom: "1.5rem" }}>Filter by subject, day, or time to find students with matching availability.</p>

      <div className="card">
        <div className="form-group">
          <label>Subject</label>
          <input type="text" placeholder="e.g. Mathematics, DSA, AI/ML" value={filters.subject} onChange={e => { setFilters({ ...filters, subject: e.target.value }); setError(null); }} />
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
          <p style={{ fontSize: "3rem" }}>??</p>
          <p className="empty">Use the filters above to find your perfect study buddy!</p>
        </div>
      )}

      {loading && <Spinner />}

      {searched && !loading && (
        <>
          <h2 style={{ margin: "1.5rem 0 1rem" }}>{results.length} match{results.length !== 1 ? "es" : ""} found</h2>
          {results.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <p style={{ fontSize: "3rem" }}>??</p>
              <p className="empty">No matches found. Try different filters.</p>
            </div>
          )}
          {results.map(student => (
            <StudentCard key={student._id} student={student} onDelete={() => setResults(prev => prev.filter(s => s._id !== student._id))} onView={() => navigate(`/student/${student._id}`)} onEdit={() => navigate(`/edit/${student._id}`)} />
          ))}
        </>
      )}
    </div>
    </PageWrapper>
  );
}
export default Match;






