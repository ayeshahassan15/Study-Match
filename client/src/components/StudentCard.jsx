import { useAuth } from "../context/AuthContext";

function StudentCard({ student, onDelete, onView, onEdit }) {
  const { user } = useAuth();
  const token = user ? localStorage.getItem("token") : null;
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const isOwner = payload && student.userId && student.userId === payload.id;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: "0.4rem" }}>{student.name}</h3>
          {student.contact && <p style={{ fontSize: "0.85rem", marginBottom: "0.6rem" }}>{student.contact}</p>}
          <div style={{ marginBottom: "0.5rem" }}>
            {student.subjects.map(s => <span key={s} className="tag">{s}</span>)}
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            {student.days.map(d => <span key={d} className="tag day">{d}</span>)}
          </div>
          <span className="tag time">{student.timeSlot}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginLeft: "1rem" }}>
          <button onClick={onView} style={{ fontSize: "0.78rem", padding: "0.3rem 0.7rem" }}>View</button>
          {isOwner && (
            <>
              <button onClick={onEdit} style={{ fontSize: "0.78rem", padding: "0.3rem 0.7rem", background: "var(--surface2)", border: "1px solid var(--border)" }}>Edit</button>
              <button className="delete-btn" onClick={() => onDelete(student._id)}>Remove</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentCard;
