import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["Todo", "In Progress", "Done"], default: "Todo" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Task", taskSchema);
