import express from "express";
import Roadmap from "../models/Roadmap.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", authMiddleware, async (req, res) => {
  const { interest, nodes } = req.body;
  console.log("POST /api/roadmap/generate - Request body:", { interest, nodes });
  if (!interest || !nodes) return res.status(400).json({ message: "Interest and nodes are required" });

  try {
    let roadmap = await Roadmap.findOne({ user: req.user.id });
    if (roadmap) return res.status(400).json({ message: "Roadmap already exists. Use /update to modify." });

    roadmap = new Roadmap({
      user: req.user.id,
      interest,
      nodes: nodes.map((node) => ({
        ...node,
        status: "not_started",
      })),
    });
    await roadmap.save();
    console.log("Roadmap saved:", roadmap);

    const user = await User.findById(req.user.id);
    nodes.forEach((node) => user.progress.set(node.id, "not_started"));
    await user.save();
    console.log("User progress updated:", user.progress);

    res.status(201).json(roadmap);
  } catch (error) {
    console.error("Generate roadmap error:", error);
    res.status(500).json({ message: "Failed to generate roadmap" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log('GET /api/roadmap - Starting request');
    console.log('User ID from token:', req.user?.id);

    if (!req.user?.id) {
      console.log('No user ID found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const roadmap = await Roadmap.findOne({ user: req.user.id });
    console.log('Roadmap query result:', roadmap ? 'Found' : 'Not found');

    if (!roadmap) {
      return res.status(404).json({ 
        message: "No roadmap found. Please generate a roadmap first.",
        userId: req.user.id 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ roadmap, progress: user.progress });
  } catch (error) {
    console.error("Fetch roadmap error:", error);
    res.status(500).json({ 
      message: "Failed to fetch roadmap",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.put("/progress", authMiddleware, async (req, res) => {
  const { nodeId, status } = req.body;
  if (!nodeId || !["not_started", "in_progress", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid nodeId or status" });
  }

  try {
    const roadmap = await Roadmap.findOne({ user: req.user.id });
    if (!roadmap) return res.status(404).json({ message: "No roadmap found" });

    const node = roadmap.nodes.find((n) => n.id === nodeId);
    if (!node) return res.status(404).json({ message: "Node not found" });

    node.status = status;
    await roadmap.save();

    const user = await User.findById(req.user.id);
    user.progress.set(nodeId, status);
    await user.save();

    res.json({ message: "Progress updated", node });
  } catch (error) {
    console.error("Update progress error:", error);
    res.status(500).json({ message: "Failed to update progress" });
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  const { interest, nodes } = req.body;
  if (!interest || !nodes) return res.status(400).json({ message: "Interest and nodes are required" });

  try {
    let roadmap = await Roadmap.findOne({ user: req.user.id });
    if (!roadmap) return res.status(404).json({ message: "No roadmap to update" });

    roadmap.interest = interest;
    roadmap.nodes = nodes.map((node) => ({
      ...node,
      status: "not_started",
    }));
    await roadmap.save();

    const user = await User.findById(req.user.id);
    user.progress.clear();
    nodes.forEach((node) => user.progress.set(node.id, "not_started"));
    await user.save();

    res.json(roadmap);
  } catch (error) {
    console.error("Update roadmap error:", error);
    res.status(500).json({ message: "Failed to update roadmap" });
  }
});

export default router;