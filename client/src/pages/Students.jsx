import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentCard from "../components/StudentCard";

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

  useEffect(() => {
    axios.get("/api/students")
      .then(res => dispatch({ type: "LOADED", payload: res.data.data }))
      .catch(() => dispatch({ type: "LOADED", payload: [] }));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/students?id=${id}`);
      dispatch({ type: "DELETE", id });
    } catch (err) {

    }
  };

  return (
    <div>
      <h1>All Registered Students</h1>
      <p style={{ marginBottom: "1.5rem" }}>{state.students.length} student{state.students.length !== 1 ? "s" : ""} registered</p>
      {state.loading && <p>Loading...</p>}
      {!state.loading && state.students.length === 0 && <p className="empty">No students registered yet.</p>}
      {state.students.map(student => (
        <StudentCard key={student._id} student={student} onDelete={handleDelete} onView={() => navigate(`/student/${student._id}`)} onEdit={() => navigate(`/edit/${student._id}`)} />
      ))}
    </div>
  );
}

export default Students;
