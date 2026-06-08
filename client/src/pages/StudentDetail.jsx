import { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import usePageTitle from "../hooks/usePageTitle";
import useKeyboard from "../hooks/useKeyboard";
import { useToast } from "../context/ToastContext";

const initialState = { student: null, loading: true, error: null, rating: null, ratingCount: 0, badges: [] };

function reducer(state, action) {
  switch (action.type) {
    case "LOADED": return { ...state, loading: false, student: action.payload };
    case "RATING_LOADED": return { ...state, rating: action.avg, ratingCount: action.count, badges: action.badges };
    case "ERROR": return { ...state, loading: false, error: action.payload };
    default: return state;
  }
}

function StudentDetail() {
  usePageTitle("Student Detail");
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [requesting, setRequesting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [rated, setRated] = useState(false);

  useKeyboard([{ key: "Escape", action: () => navigate("/students") }]);

  const getToken = () => localStorage.getItem("token");
  const getMyId = () => {
    try { return JSON.parse(atob(getToken().split(".")[1])).id; } catch { return null; }
  };

  useEffect(() => {
    axios.get(`/api/students?id=${id}`)
      .then(res => {
        dispatch({ type: "LOADED", payload: res.data.data });
        if (res.data.data.userId) {
          axios.get(`/api/ratings?userId=${res.data.data.userId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(r => dispatch({ type: "RATING_LOADED", avg: r.data.data.avg, count: r.data.data.count, badges: r.data.data.badges }))
            .catch(() => {});
        }
      })
      .catch(() => dispatch({ type: "ERROR", payload: "Student not found" }));
  }, [id]);

  const handleConnect = async () => {
    if (!state.student.userId) { showToast("This student has no account linked.", "error"); return; }
    setRequesting(true);
    try {
      await axios.post("/api/connections/send", { toUserId: state.student.userId }, { headers: { Authorization: `Bearer ${getToken()}` } });
      showToast("Connection request sent!");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send request.", "error");
    } finally {
      setRequesting(false);
    }
  };

  const handleRate = async (rating) => {
    if (!state.student.userId) { showToast("Cannot rate this student.", "error"); return; }
    try {
      const res = await axios.post("/api/ratings", { studentUserId: state.student.userId, rating }, { headers: { Authorization: `Bearer ${getToken()}` } });
      setRated(true);
      setSelectedRating(rating);
      showToast(`Rated ${rating} stars! Average: ${res.data.avg}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to rate.", "error");
    }
  };

  if (state.loading) return <Spinner />;
  if (state.error) return (
    <div style={{ textAlign: "center", padding: "3rem 0" }}>
      <p className="error">{state.error}</p>
      <button onClick={() => navigate("/students")} style={{ marginTop: "1rem" }}>Back to Students</button>
    </div>
  );

  const s = state.student;
  const myId = getMyId();
  const isOwner = s.userId === myId;

  return (
    <div>
      <h1>{s.name}</h1>
      <p style={{ marginBottom: "1rem" }}>Student Profile</p>

      {state.badges.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          {state.badges.map(b => <span key={b} className="tag" style={{ marginRight: "0.3rem" }}>{b}</span>)}
        </div>
      )}

      {state.rating && (
        <p style={{ marginBottom: "1.5rem", color: "var(--text-muted)" }}>
          Rating: {state.rating} / 5 ({state.ratingCount} rating{state.ratingCount !== 1 ? "s" : ""})
        </p>
      )}

      <div className="card">
        <h2>Subjects</h2>
        <div style={{ marginBottom: "1rem" }}>
          {s.subjects.map(sub => <span key={sub} className="tag">{sub}</span>)}
        </div>
        <h2>Available Days</h2>
        <div style={{ marginBottom: "1rem" }}>
          {s.days.map(d => <span key={d} className="tag day">{d}</span>)}
        </div>
        <h2>Time Slot</h2>
        <div style={{ marginBottom: "1rem" }}>
          <span className="tag time">{s.timeSlot}</span>
        </div>

        {!isOwner && (
          <div style={{ marginBottom: "1rem" }}>
            <h2 style={{ marginBottom: "0.5rem" }}>Rate this student</h2>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[1,2,3,4,5].map(star => (
                <button key={star}
                  onClick={() => !rated && handleRate(star)}
                  onMouseEnter={() => !rated && setHoveredRating(star)}
                  onMouseLeave={() => !rated && setHoveredRating(0)}
                  style={{ background: star <= (hoveredRating || selectedRating) ? "var(--accent)" : "var(--surface2)", border: "1px solid var(--border)", color: "white", width: "36px", height: "36px", borderRadius: "8px", cursor: rated ? "default" : "pointer", fontWeight: "bold" }}>
                  {star}
                </button>
              ))}
            </div>
            {rated && <p className="success" style={{ marginTop: "0.5rem" }}>Thanks for rating!</p>}
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
          {isOwner && <Link to={`/edit/${s._id}`}><button>Edit</button></Link>}
          {!isOwner && (
            <button onClick={handleConnect} disabled={requesting} style={{ background: "var(--accent)" }}>
              {requesting ? "Sending..." : "Connect"}
            </button>
          )}
          <button onClick={() => navigate("/students")} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;

