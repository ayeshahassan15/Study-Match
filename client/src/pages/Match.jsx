import { useState } from "react";
import axios from "axios";
import StudentCard from "../components/StudentCard";

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = ["Morning", "Afternoon", "Evening"];

function Match() {
  const [filters, setFilters] = useState({ subject: "", day: "", timeSlot: "" });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(false);
    try {
      const params = {};
      if (filters.subject) params.subject = filters.subject;
      if (filters.day) params.day = filters.day;
      if (filters.timeSlot) params.timeSlot = filters.timeSlot;

      const res = await axios.get("https://study-match-zeta.vercel.app/api/students/match", { params });
      setResults(res.data);
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          <input
            type="text"
            placeholder="e.g. Mathematics, DSA, AI/ML"
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Day</label>
          <select
            value={filters.day}
            onChange={(e) => setFilters({ ...filters, day: e.target.value })}
          >
            <option value="">Any day</option>
            {ALL_DAYS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Time Slot</label>
          <select
            value={filters.timeSlot}
            onChange={(e) => setFilters({ ...filters, timeSlot: e.target.value })}
          >
            <option value="">Any time</option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Searching...</p>}

      {searched && !loading && (
        <>
          <h2 style={{ marginBottom: "1rem" }}>
            {results.length} match{results.length !== 1 ? "es" : ""} found
          </h2>
          {results.length === 0 && (
            <p className="empty">No matches found. Try different filters.</p>
          )}
          {results.map((student) => (
            <StudentCard key={student._id} student={student} onDelete={handleDelete} />
          ))}
        </>
      )}
    </div>
  );
}

export default Match;
