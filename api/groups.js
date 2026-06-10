const mongoose = require("mongoose");
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
  } catch { return null; }
}

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  memberNames: [String],
}, { timestamps: true });

const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://study-match-r7c2.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();
  const user = getUserFromToken(req);

  const { query } = req;
  const id = query.id;

  try {
    if (req.method === "GET" && !id) {
      const groups = await Group.find().sort({ createdAt: -1 });
      return res.status(200).json({ message: "Groups fetched", data: groups });
    }

    if (req.method === "POST") {
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      const { name, subject, description } = req.body;
      if (!name || !subject) return res.status(400).json({ message: "Name and subject are required." });
      const group = new Group({ name, subject, description: description || "", createdBy: user.id, members: [user.id], memberNames: [user.name] });
      await group.save();
      return res.status(201).json({ message: "Group created successfully", data: group });
    }

    if (req.method === "PATCH" && id) {
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      const group = await Group.findById(id);
      if (!group) return res.status(404).json({ message: "Group not found" });
      if (group.members.map(m => m.toString()).includes(user.id)) return res.status(400).json({ message: "Already a member" });
      group.members.push(user.id);
      group.memberNames.push(user.name);
      await group.save();
      return res.status(200).json({ message: "Joined group successfully", data: group });
    }

    if (req.method === "PUT" && id) {
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      const group = await Group.findById(id);
      if (!group) return res.status(404).json({ message: "Group not found" });
      if (group.createdBy.toString() !== user.id) return res.status(403).json({ message: "Only the creator can edit this group." });
      const { name, description } = req.body;
      if (name) group.name = name.trim();
      if (description !== undefined) group.description = description;
      await group.save();
      return res.status(200).json({ message: "Group updated successfully", data: group });
    }

    if (req.method === "DELETE" && id) {
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      const group = await Group.findById(id);
      if (!group) return res.status(404).json({ message: "Group not found" });
      if (group.createdBy.toString() === user.id) {
        await Group.findByIdAndDelete(id);
        return res.status(200).json({ message: "Group deleted successfully" });
      }
      group.members = group.members.filter(m => m.toString() !== user.id);
      group.memberNames = group.memberNames.filter(n => n !== user.name);
      await group.save();
      return res.status(200).json({ message: "Left group successfully" });
    }

    return res.status(404).json({ message: "Route not found" });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};









