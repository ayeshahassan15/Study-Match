const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();

  const url = req.url;

  try {
    if (req.method === "POST" && url.includes("register")) {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "Invalid input data. All fields are required." });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: "Invalid input data. Password must be at least 6 characters." });
      }

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already registered." });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashed });
      await user.save();

      const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({ message: "Record created successfully", token, name: user.name });
    }

    if (req.method === "POST" && url.includes("login")) {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Invalid input data. Email and password are required." });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({ message: "Login successful", token, name: user.name });
    }

    return res.status(404).json({ message: "Route not found" });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong. Please try again later.", error: err.message });
  }
};