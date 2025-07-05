import Task from "../models/Task.js";
import ActionLog from "../models/ActionLog.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find().populate("assignedTo");
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const task = await Task.create(req.body);

  await ActionLog.create({
    actionType: "create",
    taskId: task._id,
    performedBy: req.user.id,
    details: `Created task ${task.title}`
  });

  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // conflict detection
    const incomingUpdatedAt = new Date(req.body.updatedAt);
    if (incomingUpdatedAt < task.updatedAt) {
      return res
        .status(409)
        .json({ message: "Conflict detected, please reload the task" });
    }

    // detect changes for logging
    const changes = [];
    if (req.body.status && req.body.status !== task.status) {
      changes.push(`Status changed from ${task.status} to ${req.body.status}`);
      await ActionLog.create({
        actionType: "drag-drop",
        taskId: task._id,
        performedBy: req.user.id,
        details: `Status changed from ${task.status} to ${req.body.status} for task ${task.title}`,
      });
    }
    if (req.body.assignedTo && req.body.assignedTo !== String(task.assignedTo)) {
      changes.push(`Assigned to changed from ${task.assignedTo} to ${req.body.assignedTo}`);
      await ActionLog.create({
        actionType: "assign",
        taskId: task._id,
        performedBy: req.user.id,
        details: `Assigned to changed from ${task.assignedTo} to ${req.body.assignedTo} for task ${task.title}`,
      });
    }

    // apply updates
    task.set({ ...req.body, updatedAt: Date.now() });
    await task.save();

    // log action
    await ActionLog.create({
      actionType: "update",
      taskId: task._id,
      performedBy: req.user.id,
      details: `Updated task: ${task.title}${changes.length ? ` | Changes: ${changes.join(", ")}` : ""}`,
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);

  await ActionLog.create({
    actionType: "delete",
    taskId: id,
    performedBy: req.user.id,
    details: `Deleted task ${id}`
  });

  res.json({ message: "Task deleted" });
};

export const getLogs = async (req, res) => {
  const logs = await ActionLog.find().sort({ timestamp: -1 }).limit(20).populate("performedBy taskId");
  res.json(logs);
};
