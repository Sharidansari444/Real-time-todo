import { useEffect, useState, useContext } from "react";
import { getLogs } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    const data = await getLogs(token);
    setLogs(data);
  };

  return (
    <div className="log-panel">
      <h3>Recent Activity</h3>
      <ul>
        {logs.map((log) => (
          <li key={log._id}>
            {log.details} by {log.performedBy?.name} on{" "}
            {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
