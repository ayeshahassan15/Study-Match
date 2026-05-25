const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subjects: {
      type: [String],
      required: true,
    },
    days: {
      type: [String],
      required: true,
    },
    timeSlot: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening"],
      required: true,
    },
    contact: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
