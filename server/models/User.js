const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    badges: {
      type: [String],
      default: [],
    },
    ratings: {
      total: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    connectionRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notifications: [
      {
        message: String,
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
