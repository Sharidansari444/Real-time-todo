import express from "express";
import { getTasks, createTask, updateTask, deleteTask, getLogs } from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", protect, getTasks);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.get("/logs", protect, getLogs);

export default router;
