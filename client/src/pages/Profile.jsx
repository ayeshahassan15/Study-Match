import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import StudentCard from "../components/StudentCard";
import Spinner from "../components/Spinner";
import usePageTitle from "../hooks/usePageTitle";

const initialState = { students: [], loading: true, userInfo: null };

function reducer(state, action) {
  switch (action.type) {
    case "LOADED": return { loading: false, students: action.students, userInfo: action.userInfo };
    case "DELETE": return { ...state, students: state.students.filter(s => s._id !== action.id) };
    default: return state;
  }
}

function Profile() {
  usePageTitle("My Profile");
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const getToken = () => localStorage.getItem("token");

  const getMyId = () => {
    try {
      const token = getToken();
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch { return null; }
  };

  useEffect(() => {
    const myId = getMyId();
    const token = getToken();
    Promise.all([
      axios.get("/api/students"),
      axios.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
    ])
      .then(([studentsRes, userRes]) => {
        const myStudents = studentsRes.data.data.filter(s => s.userId === myId);
        dispatch({ type: "LOADED", students: myStudents, userInfo: userRes.data.data });
      })
      .catch(() => dispatch({ type: "LOADED", students: [], userInfo: null }));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this student?")) return;
    try {
      await axios.delete(`/api/students?id=${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      dispatch({ type: "DELETE", id });
      showToast("Student removed successfully!");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete.", "error");
    }
  };

  const avgRating = state.userInfo?.ratings?.count > 0
    ? (state.userInfo.ratings.total / state.userInfo.ratings.count).toFixed(1)
    : null;

  return (
    <div>
      <h1>My Profile</h1>
      <p style={{ marginBottom: "1.5rem" }}>Manage your account and registered students</p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Account Info</h2>
        {state.loading ? <Spinner /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <p>Name: <strong style={{ color: "var(--text)" }}>{user?.name}</strong></p>
            <p>Email: <strong style={{ color: "var(--text)" }}>{state.userInfo?.email}</strong></p>
            <p>Students Registered: <strong style={{ color: "var(--accent)" }}>{state.students.length}</strong></p>
            {avgRating && <p>Average Rating: <strong style={{ color: "var(--success)" }}>? {avgRating} / 5 ({state.userInfo.ratings.count} ratings)</strong></p>}
          </div>
        )}
      </div>

      {state.userInfo?.badges?.length > 0 && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>My Badges</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {state.userInfo.badges.map(b => (
              <span key={b} className="tag" style={{ fontSize: "0.9rem", padding: "0.4rem 0.8rem" }}>{b}</span>
            ))}
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: "1rem" }}>My Registered Students ({state.loading ? "..." : state.students.length})</h2>

      {state.loading && <Spinner />}

      {!state.loading && state.students.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <p style={{ fontSize: "3rem" }}>??</p>
          <p className="empty">You have not registered any students yet.</p>
          <button onClick={() => navigate("/")} style={{ marginTop: "1rem" }}>Register Now</button>
        </div>
      )}

      {state.students.map(student => (
        <StudentCard key={student._id} student={student} onDelete={handleDelete} onView={() => navigate(`/student/${student._id}`)} onEdit={() => navigate(`/edit/${student._id}`)} />
      ))}
    </div>
  );
}

export default Profile;
