const Student = require("../models/Student");

// GET all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Students fetched successfully", data: students });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again later.", error: err.message });
  }
};

// GET single student
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Student fetched successfully", data: student });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again later.", error: err.message });
  }
};

// POST create student
exports.createStudent = async (req, res) => {
  try {
    const { name, subjects, days, timeSlot, contact } = req.body;

    if (!name || !subjects || !days || !timeSlot) {
      return res.status(400).json({ message: "Invalid input data. Name, subjects, days and timeSlot are required." });
    }
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ message: "Invalid input data. At least one subject is required." });
    }
    if (!Array.isArray(days) || days.length === 0) {
      return res.status(400).json({ message: "Invalid input data. At least one day is required." });
    }

    const student = new Student({ name, subjects, days, timeSlot, contact });
    const saved = await student.save();
    res.status(201).json({ message: "Record created successfully", data: saved });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again later.", error: err.message });
  }
};

// PUT update full student
exports.updateStudent = async (req, res) => {
  try {
    const { name, subjects, days, timeSlot, contact } = req.body;

    if (!name || !subjects || !days || !timeSlot) {
      return res.status(400).json({ message: "Invalid input data. All fields are required for full update." });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, subjects, days, timeSlot, contact },
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record updated successfully", data: student });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again later.", error: err.message });
  }
};

// PATCH partial update
exports.patchStudent = async (req, res) => {
  try {
    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Invalid input data. No fields provided for update." });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record updated successfully", data: student });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again later.", error: err.message });
  }
};

// DELETE student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again later.", error: err.message });
  }
};

// GET match students
exports.matchStudents = async (req, res) => {
  try {
    const { subject, day, timeSlot } = req.query;
    const query = {};
    if (subject) query.subjects = { $in: [new RegExp(subject, "i")] };
    if (day) query.days = { $in: [day] };
    if (timeSlot) query.timeSlot = timeSlot;

    const matches = await Student.find(query).sort({ createdAt: -1 });
    res.status(200).json({ message: "Matches fetched successfully", data: matches });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again later.", error: err.message });
  }
};