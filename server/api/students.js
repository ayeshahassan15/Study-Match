const mongoose = require("mongoose");
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  patchStudent,
  deleteStudent,
  matchStudents,
} = require("../controllers/studentController");

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://study-match-4xx2.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();

  const url = req.url;
  const id = req.query.id;

  // Match route
  if (req.method === "GET" && url.includes("match")) {
    return matchStudents(req, res);
  }

  // Routes with ID
  if (id) {
    req.params = { id };
    if (req.method === "GET") return getStudentById(req, res);
    if (req.method === "PUT") return updateStudent(req, res);
    if (req.method === "PATCH") return patchStudent(req, res);
    if (req.method === "DELETE") return deleteStudent(req, res);
  }

  // Routes without ID
  if (req.method === "GET") return getAllStudents(req, res);
  if (req.method === "POST") return createStudent(req, res);

  return res.status(404).json({ message: "Route not found" });
};