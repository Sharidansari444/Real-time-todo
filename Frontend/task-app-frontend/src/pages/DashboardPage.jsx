import Board from "../components/kanban/Board";
import ActivityLog from "../components/ActivityLog";

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <Board />
      <ActivityLog />
    </div>
  );
}
