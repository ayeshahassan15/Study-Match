import axios from "axios";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function StudentCard({ student, onDelete }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`https://study-match-zeta.vercel.app/api/students/${student._id}`);
      onDelete(student._id);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ marginBottom: "0.4rem" }}>{student.name}</h3>
          {student.contact && (
            <p style={{ fontSize: "0.85rem", marginBottom: "0.6rem" }}>{student.contact}</p>
          )}
          <div style={{ marginBottom: "0.5rem" }}>
            {student.subjects.map((s) => (
              <span key={s} className="tag">{s}</span>
            ))}
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            {student.days.map((d) => (
              <span key={d} className="tag day">{d}</span>
            ))}
          </div>
          <span className="tag time">{student.timeSlot}</span>
        </div>
        <button className="delete-btn" onClick={handleDelete}>Remove</button>
      </div>
    </div>
  );
}

export default StudentCard;
