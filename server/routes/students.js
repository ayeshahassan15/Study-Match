const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  patchStudent,
  deleteStudent,
  matchStudents,
} = require("../controllers/studentController");

router.get("/match", matchStudents);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.patch("/:id", patchStudent);
router.delete("/:id", deleteStudent);

module.exports = router;