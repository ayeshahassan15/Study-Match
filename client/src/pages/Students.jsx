import { useEffect, useState } from "react";
import axios from "axios";
import StudentCard from "../components/StudentCard";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://study-match-pi.vercel.app/api/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

 const handleDelete = async (id) => {
  try {
    await axios.delete(`https://study-match-pi.vercel.app/api/students?id=${id}`);
    setStudents((prev) => prev.filter((s) => s._id !== id));
  } catch (err) {
    console.error("Failed to delete student:", err);
  }
};

  return (
    <div>
      <h1>All Registered Students</h1>
      <p style={{ marginBottom: "1.5rem" }}>{students.length} student{students.length !== 1 ? "s" : ""} registered</p>

      {loading && <p>Loading...</p>}

      {!loading && students.length === 0 && (
        <p className="empty">No students registered yet. Be the first one!</p>
      )}

      {students.map((student) => (
        <StudentCard key={student._id} student={student} onDelete={handleDelete} />
      ))}
    </div>
  );
}

export default Students;
