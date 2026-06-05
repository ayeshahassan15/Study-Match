const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const studentRoutes = require("./routes/students");
const authRoutes = require("./routes/auth");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use("https://study-match-pi.vercel.app/api/students", studentRoutes);
app.use("https://study-match-pi.vercel.app/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("Study Match API is running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;