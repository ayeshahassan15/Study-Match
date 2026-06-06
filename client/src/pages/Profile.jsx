import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import StudentCard from "../components/StudentCard";

const initialState = { students: [], loading: true };

function reducer(state, action) {
  switch (action.type) {
    case "LOADED": return { loading: false, students: action.payload };
    case "DELETE": return { ...state, students: state.students.filter(s => s._id !== action.id) };
    default: return state;
  }
}

function Profile() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios.get("/api/students")
      .then(res => {
        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const myStudents = res.data.data.filter(s => s.userId === payload.id);
        dispatch({ type: "LOADED", payload: myStudents });
      })
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
      showToast(err.response?.data?.message || "Failed to delete.", "error");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>My Profile</h1>
      <p style={{ marginBottom: "1.5rem" }}>Manage your account and registered students</p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>Account Info</h2>
        <p style={{ marginBottom: "0.3rem" }}>Name: <strong style={{ color: "var(--text)" }}>{user?.name}</strong></p>
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleLogout} className="delete-btn" style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}>Log Out</button>
        </div>
      </div>

      <h2 style={{ marginBottom: "1rem" }}>My Registered Students ({state.students.length})</h2>

      {state.loading && <p>Loading...</p>}

      {!state.loading && state.students.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <p style={{ fontSize: "3rem" }}>📭</p>
          <p className="empty">You haven't registered any students yet.</p>
        </div>
      )}

      {state.students.map(student => (
        <StudentCard key={student._id} student={student} onDelete={handleDelete} onView={() => navigate(`/student/${student._id}`)} onEdit={() => navigate(`/edit/${student._id}`)} />
      ))}
    </div>
  );
}

export default Profile;