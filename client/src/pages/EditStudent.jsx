import { useEffect, useReducer, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const initialState = { form: null, loading: true, saving: false, errors: {} };

function reducer(state, action) {
  switch (action.type) {
    case "LOADED": return { ...state, loading: false, form: action.payload };
    case "SET_FIELD": return { ...state, form: { ...state.form, [action.field]: action.value }, errors: { ...state.errors, [action.field]: null } };
    case "SAVING": return { ...state, saving: true, errors: {} };
    case "SAVED": return { ...state, saving: false };
    case "SET_ERRORS": return { ...state, errors: action.payload };
    default: return state;
  }
}

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const nameRef = useRef();
  const { showToast } = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios.get(`/api/students?id=${id}`)
      .then(res => { dispatch({ type: "LOADED", payload: res.data.data }); setTimeout(() => nameRef.current?.focus(), 100); })
      .catch(() => { showToast("Failed to load student.", "error"); navigate("/students"); });
  }, [id]);

  const validate = () => {
    const errs = {};
    const f = state.form;
    if (!f.name.trim()) errs.name = "Name is required";
    else if (f.name.trim().length < 3) errs.name = "Name must be at least 3 characters";
    else if (!/^[a-zA-Z\s]+$/.test(f.name)) errs.name = "Name can only contain letters and spaces";
    if (!f.subjects || f.subjects.length === 0) errs.subjects = "Select at least one subject";
    if (!f.days || f.days.length === 0) errs.days = "Select at least one day";
    if (!f.timeSlot) errs.timeSlot = "Time slot is required";
    return errs;
  };

  const toggleDay = (day) => {
    const days = state.form.days.includes(day)
      ? state.form.days.filter(d => d !== day)
      : [...state.form.days, day];
    dispatch({ type: "SET_FIELD", field: "days", value: days });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { dispatch({ type: "SET_ERRORS", payload: errs }); return; }
    if (!window.confirm("Are you sure you want to save these changes?")) return;
    dispatch({ type: "SAVING" });
    try {
      await axios.put(`/api/students?id=${id}`, state.form);
      dispatch({ type: "SAVED" });
      showToast("Student updated successfully!");
      setTimeout(() => navigate("/students"), 800);
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed.", "error");
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
            <label>Name *</label>
            <input ref={nameRef} type="text" value={f.name} onChange={e => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })} />
            {state.errors.name && <p className="error" style={{ marginTop: "0.3rem" }}>{state.errors.name}</p>}
          </div>
          <div className="form-group">
            <label>Subjects (comma separated) *</label>
            <input type="text" value={f.subjects.join(", ")} onChange={e => dispatch({ type: "SET_FIELD", field: "subjects", value: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
            {state.errors.subjects && <p className="error" style={{ marginTop: "0.3rem" }}>{state.errors.subjects}</p>}
          </div>
          <div className="form-group">
            <label>Available Days *</label>
            <div className="checkbox-group">
              {DAYS.map(day => (
                <label key={day}><input type="checkbox" checked={f.days.includes(day)} onChange={() => toggleDay(day)} />{day}</label>
              ))}
            </div>
            {state.errors.days && <p className="error" style={{ marginTop: "0.3rem" }}>{state.errors.days}</p>}
          </div>
          <div className="form-group">
            <label>Time Slot *</label>
            <select value={f.timeSlot} onChange={e => dispatch({ type: "SET_FIELD", field: "timeSlot", value: e.target.value })}>
              <option value="">Select time slot</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
            {state.errors.timeSlot && <p className="error" style={{ marginTop: "0.3rem" }}>{state.errors.timeSlot}</p>}
          </div>
          <div className="form-group">
            <label>Contact</label>
            <input type="text" value={f.contact || ""} onChange={e => dispatch({ type: "SET_FIELD", field: "contact", value: e.target.value })} />
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            <button type="submit" disabled={state.saving}>{state.saving ? "Saving..." : "Save Changes"}</button>
            <button type="button" onClick={() => navigate("/students")} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStudent;
