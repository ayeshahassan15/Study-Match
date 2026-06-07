const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../server/models/User");

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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const url = req.url;

  try {
    // Send connection request
    if (req.method === "POST" && url.includes("send")) {
      const { toUserId } = req.body;
      if (toUserId === user.id) return res.status(400).json({ message: "Cannot send request to yourself" });
      const toUser = await User.findById(toUserId);
      if (!toUser) return res.status(404).json({ message: "User not found" });
      if (toUser.connectionRequests.includes(user.id)) return res.status(400).json({ message: "Request already sent" });
      if (toUser.connections.includes(user.id)) return res.status(400).json({ message: "Already connected" });
      toUser.connectionRequests.push(user.id);
      toUser.notifications.push({ message: `${user.name} sent you a connection request!` });
      await toUser.save();
      return res.status(200).json({ message: "Connection request sent!" });
    }

    // Accept connection request
    if (req.method === "PATCH" && url.includes("accept")) {
      const { fromUserId } = req.body;
      const me = await User.findById(user.id);
      if (!me.connectionRequests.includes(fromUserId)) return res.status(400).json({ message: "No request found" });
      me.connectionRequests = me.connectionRequests.filter(id => id.toString() !== fromUserId);
      me.connections.push(fromUserId);
      me.badges = [...new Set([...me.badges, "🤝 Connected"])];
      await me.save();
      const fromUser = await User.findById(fromUserId);
      fromUser.connections.push(user.id);
      fromUser.notifications.push({ message: `${me.name} accepted your connection request!` });
      fromUser.badges = [...new Set([...fromUser.badges, "🤝 Connected"])];
      await fromUser.save();
      return res.status(200).json({ message: "Connection accepted!" });
    }

    // Reject connection request
    if (req.method === "PATCH" && url.includes("reject")) {
      const { fromUserId } = req.body;
      const me = await User.findById(user.id);
      me.connectionRequests = me.connectionRequests.filter(id => id.toString() !== fromUserId);
      await me.save();
      return res.status(200).json({ message: "Connection request rejected" });
    }

    // Get my connections and requests
    if (req.method === "GET") {
      const me = await User.findById(user.id)
        .populate("connections", "name email")
        .populate("connectionRequests", "name email");
      return res.status(200).json({ message: "Fetched successfully", data: { connections: me.connections, requests: me.connectionRequests, notifications: me.notifications } });
    }

    return res.status(404).json({ message: "Route not found" });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};