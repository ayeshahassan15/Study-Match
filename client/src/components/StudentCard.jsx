import axios from "axios";

const API = "https://study-match-zeta.vercel.app";

function StudentCard({ student, onDelete }) {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/students?id=${student._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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