import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentCard from "../components/StudentCard";
import { useToast } from "../context/ToastContext";

const PAGE_SIZE = 5;
const initialState = { students: [], loading: true };

function reducer(state, action) {
  switch (action.type) {
    case "LOADED": return { loading: false, students: action.payload };
    case "DELETE": return { ...state, students: state.students.filter(s => s._id !== action.id) };
    default: return state;
  }
}

function Students() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    axios.get("/api/students")
      .then(res => dispatch({ type: "LOADED", payload: res.data.data }))
      .catch(() => dispatch({ type: "LOADED", payload: [] }));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this student?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/students?id=${id}`, { headers: { Authorization: `Bearer ${token}` } });
      dispatch({ type: "DELETE", id });
      showToast("Student removed successfully!");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete student.", "error");
    }
  };

  const filtered = state.students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.subjects.some(sub => sub.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <h1>All Registered Students</h1>
      <p style={{ marginBottom: "1rem" }}>{filtered.length} student{filtered.length !== 1 ? "s" : ""} found</p>

      <div className="form-group" style={{ marginBottom: "1.5rem" }}>
        <input type="text" placeholder="Search by name or subject..." value={search} onChange={handleSearch} />
      </div>

      {state.loading && <p>Loading...</p>}

      {!state.loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <p style={{ fontSize: "3rem" }}>??</p>
          <p className="empty">{search ? "No students match your search." : "No students registered yet. Be the first one!"}</p>
        </div>
      )}

      {paginated.map(student => (
        <StudentCard key={student._id} student={student} onDelete={handleDelete} onView={() => navigate(`/student/${student._id}`)} onEdit={() => navigate(`/edit/${student._id}`)} />
      ))}

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", padding: "0.4rem 0.9rem" }}>Previous</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ background: p === page ? "var(--accent)" : "var(--surface2)", border: "1px solid var(--border)", color: "white", padding: "0.4rem 0.9rem" }}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", padding: "0.4rem 0.9rem" }}>Next</button>
        </div>
      )}
    </div>
  );
}

export default Students;
