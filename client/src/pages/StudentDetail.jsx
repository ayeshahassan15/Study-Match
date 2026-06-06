import { useEffect, useReducer } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const initialState = { student: null, loading: true, error: null };

function reducer(state, action) {
  switch (action.type) {
    case "LOADED": return { ...state, loading: false, student: action.payload };
    case "ERROR": return { ...state, loading: false, error: action.payload };
    default: return state;
  }
}

function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios.get(`/api/students?id=${id}`)
      .then(res => dispatch({ type: "LOADED", payload: res.data.data }))
      .catch(() => dispatch({ type: "ERROR", payload: "Student not found" }));
  }, [id]);

  if (state.loading) return <p>Loading...</p>;
  if (state.error) return <p className="error">{state.error}</p>;

  const s = state.student;

  return (
    <div>
      <h1>{s.name}</h1>
      <p style={{ marginBottom: "1.5rem" }}>Student Profile</p>
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
        {s.contact && <><h2>Contact</h2><p style={{ marginBottom: "1rem" }}>{s.contact}</p></>}
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Link to={`/edit/${s._id}`}><button>Edit</button></Link>
          <button className="delete-btn" onClick={() => navigate("/students")}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;
