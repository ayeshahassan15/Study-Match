const mongoose = require("mongoose");
const Student = require("../models/Student");

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://study-match-4xx2.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();

  const { method, query } = req;
  const id = query.id;

  try {
    if (method === "GET" && query.match) {
      const { subject, day, timeSlot } = query;
      const filter = {};
      if (subject) filter.subjects = { $in: [new RegExp(subject, "i")] };
      if (day) filter.days = { $in: [day] };
      if (timeSlot) filter.timeSlot = timeSlot;
      const matches = await Student.find(filter).sort({ createdAt: -1 });
      return res.json(matches);
    }

    if (method === "GET") {
      const students = await Student.find().sort({ createdAt: -1 });
      return res.json(students);
    }

    if (method === "POST") {
      const student = new Student(req.body);
      const saved = await student.save();
      return res.status(201).json(saved);
    }

    if (method === "DELETE" && id) {
      await Student.findByIdAndDelete(id);
      return res.json({ message: "Student removed" });
    }

    return res.status(404).json({ error: "Not found" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};