import mongoose from "mongoose";

const actionLogSchema = new mongoose.Schema({
  actionType: String,
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now },
  details: String
});

export default mongoose.model("ActionLog", actionLogSchema);
