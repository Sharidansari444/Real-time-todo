import "../../styles/main.css";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../api/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
export default function Board() {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
    socket.on("taskUpdated", fetchTasks);
    return () => socket.off("taskUpdated");
  }, []);

  const fetchTasks = async () => {
    const data = await getTasks(token);
    console.log("Fetched tasks from backend:", data);
    setTasks(data);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId.trim();

    const existingTask = tasks.find((t) => t._id === taskId);
    if (!existingTask) return;

    try {
      const updatedTask = await updateTask(
        taskId,
        {
          ...existingTask,
          status: newStatus,
          updatedAt: existingTask.updatedAt, // for conflict detection
        },
        token
      );

      if (updatedTask.message?.includes("Conflict")) {
        alert(updatedTask.message);
        await fetchTasks();
      } else {
        await fetchTasks();
        socket.emit("taskUpdated");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async () => {
    const title = prompt("Task title?");
    const description = prompt("Task description?");
    const priority = prompt("Priority (Low, Medium, High)?");
    if (title) {
      await createTask(
        {
          title,
          description,
          priority,
          status: "Todo",
          assignedTo: null,
        },
        token
      );
      socket.emit("taskUpdated");
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Delete this task?")) {
      await deleteTask(id, token);
      socket.emit("taskUpdated");
    }
  };

  const handleEditTask = async (task) => {
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
          updatedAt: task.updatedAt,
        },
        token
      );

      if (updated.message?.includes("Conflict")) {
        alert(updated.message);
        await fetchTasks();
      } else {
        await fetchTasks();
        socket.emit("taskUpdated");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    }
  };

  const getByStatus = (status) => tasks.filter((t) => t.status === status);

  return (
    <>
      <button onClick={handleCreateTask} style={{ margin: "10px" }}>
        + Add Task
      </button>
      {tasks.length === 0 ? (
        <div style={{ color: "#b00", margin: "20px" }}>
          No tasks loaded. Check backend/API or add a new task.
        </div>
      ) : null}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board" >
          {["Todo", "In Progress", "Done"].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: 1,
                    minHeight: "500px",
                    background: "#f0f0f0",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                >
                  <h1>{status}</h1>
                  {getByStatus(status).map((task, index) => (
                    !task._id ? (
                      <div key={index} style={{ color: "red" }}>Task missing _id</div>
                    ) : (
                      <Draggable
                        key={task._id}
                        draggableId={String(task._id)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <TaskCard
                            task={task}
                            provided={provided}
                            snapshot={snapshot}
                            onDelete={handleDeleteTask}
                            onEdit={handleEditTask}
                          />
                        )}
                      </Draggable>
                    )
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
}
