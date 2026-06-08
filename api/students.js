const mongoose = require("mongoose");
const Student = require("../server/models/Student");
const jwt = require("jsonwebtoken");

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

function getUserFromToken(req) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return null;
    const token = auth.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://study-match-r7c2.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();

  const { method, query } = req;
  const id = query.id;

  try {
    // Match route
    if (method === "GET" && query.match) {
      const { subject, day, timeSlot } = query;
      const filter = {};
      if (subject) filter.subjects = { $in: [new RegExp(subject, "i")] };
      if (day) filter.days = { $in: [day] };
      if (timeSlot) filter.timeSlot = timeSlot;
      const matches = await Student.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ message: "Matches fetched successfully", data: matches });
    }

    // GET all
    if (method === "GET" && !id) {
      const students = await Student.find().sort({ createdAt: -1 });
      return res.status(200).json({ message: "Students fetched successfully", data: students });
    }

    // GET by ID
    if (method === "GET" && id) {
      const student = await Student.findById(id);
      if (!student) return res.status(404).json({ message: "Record not found" });
      return res.status(200).json({ message: "Student fetched successfully", data: student });
    }

    // POST
    if (method === "POST") {
      const user = getUserFromToken(req);
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      const existing = await Student.findOne({ userId: user.id });
      if (existing) return res.status(400).json({ message: "You already have a student profile. You can only register one." });
      const { name, subjects, days, timeSlot, contact } = req.body;
      if (!name || !subjects || !days || !timeSlot) {
        return res.status(400).json({ message: "Invalid input data. Name, subjects, days and timeSlot are required." });
      }
      const student = new Student({ name, subjects, days, timeSlot, contact, userId: user?.id || null });
      const saved = await student.save();
      return res.status(201).json({ message: "Record created successfully", data: saved });
    }

    // PUT
    if (method === "PUT" && id) {
      const user = getUserFromToken(req);
      const { name, subjects, days, timeSlot, contact } = req.body;
      if (!name || !subjects || !days || !timeSlot) {
        return res.status(400).json({ message: "Invalid input data. All fields are required for full update." });
      }
      const student = await Student.findById(id);
      if (!student) return res.status(404).json({ message: "Record not found" });
      if (student.userId && user?.id !== student.userId.toString()) {
        return res.status(403).json({ message: "You can only edit your own students." });
      }
      const updated = await Student.findByIdAndUpdate(id, { name, subjects, days, timeSlot, contact }, { new: true, runValidators: true });
      return res.status(200).json({ message: "Record updated successfully", data: updated });
    }

    // PATCH
    if (method === "PATCH" && id) {
      const user = getUserFromToken(req);
      const updates = req.body;
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "Invalid input data. No fields provided for update." });
      }
      const student = await Student.findById(id);
      if (!student) return res.status(404).json({ message: "Record not found" });
      if (student.userId && user?.id !== student.userId.toString()) {
        return res.status(403).json({ message: "You can only edit your own students." });
      }
      const updated = await Student.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
      return res.status(200).json({ message: "Record updated successfully", data: updated });
    }

    // DELETE
    if (method === "DELETE" && id) {
      const user = getUserFromToken(req);
      const student = await Student.findById(id);
      if (!student) return res.status(404).json({ message: "Record not found" });
      if (student.userId && user?.id !== student.userId.toString()) {
        return res.status(403).json({ message: "You can only delete your own students." });
      }
      await Student.findByIdAndDelete(id);
      return res.status(200).json({ message: "Record deleted successfully" });
    }

    return res.status(404).json({ message: "Route not found" });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong. Please try again later.", error: err.message });
  }
};

