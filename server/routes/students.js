const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// Add a new student
router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    const saved = await student.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Find matches by subject, day, and time slot
router.get("/match", async (req, res) => {
  try {
    const { subject, day, timeSlot } = req.query;

    const query = {};
    if (subject) query.subjects = { $in: [new RegExp(subject, "i")] };
    if (day) query.days = { $in: [day] };
    if (timeSlot) query.timeSlot = timeSlot;

    const matches = await Student.find(query).sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a student
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
