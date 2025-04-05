import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "CUser", required: true },
  interest: { type: String, required: true }, // e.g., "DSA"
  nodes: [
    {
      id: { type: String, required: true }, // Unique ID for each task
      title: { type: String, required: true }, // e.g., "Learn Arrays"
      description: { type: String }, // e.g., "Understand array operations"
      resources: [{ type: String }], // e.g., ["link1", "link2"]
      task: { type: String }, // e.g., "Solve 5 array problems"
      status: { type: String, enum: ["not_started", "in_progress", "completed"], default: "not_started" },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

roadmapSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Roadmap", roadmapSchema);