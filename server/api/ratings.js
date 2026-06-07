const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../server/models/User");
const Student = require("../server/models/Student");

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
  } catch { return null; }
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://study-match-r7c2.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    if (req.method === "POST") {
      const { studentUserId, rating } = req.body;
      if (!studentUserId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5." });
      }
      if (studentUserId === user.id) {
        return res.status(400).json({ message: "Cannot rate yourself." });
      }
      const targetUser = await User.findById(studentUserId);
      if (!targetUser) return res.status(404).json({ message: "User not found" });
      targetUser.ratings.total += rating;
      targetUser.ratings.count += 1;
      const avg = targetUser.ratings.total / targetUser.ratings.count;
      if (avg >= 4.5) targetUser.badges = [...new Set([...targetUser.badges, "⭐ Top Rated"])];
      targetUser.notifications.push({ message: `Someone rated you ${rating} stars!` });
      await targetUser.save();
      return res.status(200).json({ message: "Rating submitted!", avg: avg.toFixed(1) });
    }

    if (req.method === "GET") {
      const { userId } = req.query;
      const targetUser = await User.findById(userId).select("ratings badges name");
      if (!targetUser) return res.status(404).json({ message: "User not found" });
      const avg = targetUser.ratings.count > 0
        ? (targetUser.ratings.total / targetUser.ratings.count).toFixed(1)
        : null;
      return res.status(200).json({ message: "Rating fetched", data: { avg, count: targetUser.ratings.count, badges: targetUser.badges } });
    }

    return res.status(404).json({ message: "Route not found" });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};