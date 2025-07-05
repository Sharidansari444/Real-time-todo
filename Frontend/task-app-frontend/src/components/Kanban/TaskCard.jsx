import { updateTask } from "../../api/api";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import io from "socket.io-client";
import "../../styles/main.css";

const socket = io("http://localhost:5000");

export default function TaskCard({ task, provided, snapshot, onDelete }) {
  const { token } = useContext(AuthContext);

  const handleEdit = async () => {
    const newTitle = prompt("New title", task.title);
    const newDescription = prompt("New description", task.description);
    const newPriority = prompt("New priority", task.priority);

    try {
      const updated = await updateTask(
        task._id,
        {
          ...task,
          title: newTitle,
          description: newDescription,
          priority: newPriority,
          updatedAt: task.updatedAt, // important for conflict check
        },
        token
      );

      if (updated.message?.includes("Conflict")) {
        alert(updated.message);
      } else {
        socket.emit("taskUpdated");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    }
  };

  return (
    <div
      className={`task-card ${snapshot.isDragging ? "flipped" : ""}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <small>Priority: {task.priority}</small>
      <div style={{ marginTop: "8px" }}>
        <button onClick={() => onDelete(task._id)}>Delete</button>
        <button onClick={handleEdit} style={{ marginLeft: "4px" }}>
          Edit
        </button>
      </div>
    </div>
  );
}

