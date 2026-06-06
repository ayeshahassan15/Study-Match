import { useEffect, useReducer, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const initialState = { form: null, loading: true, saving: false, error: null, success: null };

function reducer(state, action) {
  switch (action.type) {
    case "LOADED": return { ...state, loading: false, form: action.payload };
    case "SET_FIELD": return { ...state, form: { ...state.form, [action.field]: action.value } };
    case "SAVING": return { ...state, saving: true, error: null, success: null };
    case "SAVED": return { ...state, saving: false, success: "Updated successfully!" };
    case "ERROR": return { ...state, saving: false, error: action.payload };
    default: return state;
  }
}

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const nameRef = useRef();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios.get(`/api/students?id=${id}`)
      .then(res => { dispatch({ type: "LOADED", payload: res.data.data }); setTimeout(() => nameRef.current?.focus(), 100); })
      .catch(() => dispatch({ type: "ERROR", payload: "Failed to load student" }));
  }, [id]);

  const toggleDay = (day) => {
    const days = state.form.days.includes(day)
      ? state.form.days.filter(d => d !== day)
      : [...state.form.days, day];
    dispatch({ type: "SET_FIELD", field: "days", value: days });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SAVING" });
    try {
      await axios.put(`/api/students?id=${id}`, state.form);
      dispatch({ type: "SAVED" });
      setTimeout(() => navigate("/students"), 1000);
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.response?.data?.message || "Update failed" });
    }
  };

  if (state.loading) return <p>Loading...</p>;
  if (!state.form) return <p className="error">Student not found</p>;

  const f = state.form;

  return (
    <div>
      <h1>Edit Student</h1>
      <p style={{ marginBottom: "1.5rem" }}>Update student information</p>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input ref={nameRef} type="text" value={f.name} onChange={e => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Subjects (comma separated)</label>
            <input type="text" value={f.subjects.join(", ")} onChange={e => dispatch({ type: "SET_FIELD", field: "subjects", value: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
          </div>
          <div className="form-group">
            <label>Available Days</label>
            <div className="checkbox-group">
              {DAYS.map(day => (
                <label key={day}>
                  <input type="checkbox" checked={f.days.includes(day)} onChange={() => toggleDay(day)} />
                  {day}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Time Slot</label>
            <select value={f.timeSlot} onChange={e => dispatch({ type: "SET_FIELD", field: "timeSlot", value: e.target.value })}>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
          </div>
          <div className="form-group">
            <label>Contact</label>
            <input type="text" value={f.contact || ""} onChange={e => dispatch({ type: "SET_FIELD", field: "contact", value: e.target.value })} />
          </div>
          {state.error && <p className="error">{state.error}</p>}
          {state.success && <p className="success">{state.success}</p>}
          <button type="submit" disabled={state.saving}>{state.saving ? "Saving..." : "Save Changes"}</button>
        </form>
      </div>
    </div>
  );
}

export default EditStudent;
