const mongoose = require("mongoose");
const { register, login } = require("../controllers/authController");

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://study-match-4xx2.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();

  const url = req.url;

  if (req.method === "POST" && url.includes("register")) return register(req, res);
  if (req.method === "POST" && url.includes("login")) return login(req, res);

  return res.status(404).json({ message: "Route not found" });
};