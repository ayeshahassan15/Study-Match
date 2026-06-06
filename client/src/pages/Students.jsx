import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentCard from "../components/StudentCard";
import { useToast } from "../context/ToastContext";

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
      await axios.delete(`/api/students?id=${id}`);
      dispatch({ type: "DELETE", id });
      showToast("Student removed successfully!");
    } catch (err) {
      showToast("Failed to delete student.", "error");
    }
  };

  return (
    <div>
      <h1>All Registered Students</h1>
      <p style={{ marginBottom: "1.5rem" }}>{state.students.length} student{state.students.length !== 1 ? "s" : ""} registered</p>
      {state.loading && <p>Loading...</p>}
      {!state.loading && state.students.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <p style={{ fontSize: "3rem" }}>??</p>
          <p className="empty">No students registered yet. Be the first one!</p>
        </div>
      )}
      {state.students.map(student => (
        <StudentCard key={student._id} student={student} onDelete={handleDelete} onView={() => navigate(`/student/${student._id}`)} onEdit={() => navigate(`/edit/${student._id}`)} />
      ))}
    </div>
  );
}

export default Students;
