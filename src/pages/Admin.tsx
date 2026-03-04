import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { StatsCard } from "@/components/StatsCard";
import { LevelBadge } from "@/components/LevelBadge";
import { Users, ListTodo, CheckCircle2, Trophy } from "lucide-react";
import { Navigate } from "react-router-dom";

export default function Admin() {
  const { user, users } = useAuth();
  const { allTasks, allRewards } = useTasks();

  if (!user || user.role !== "admin") return <Navigate to="/dashboard" replace />;

  const totalCompleted = allTasks.filter(t => t.status === "completed").length;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-display font-bold">Admin Panel</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Users" value={users.length} icon={Users} />
          <StatsCard title="Total Tasks" value={allTasks.length} icon={ListTodo} />
          <StatsCard title="Completed Tasks" value={totalCompleted} icon={CheckCircle2} gradient />
          <StatsCard title="Total Rewards" value={allRewards.length} icon={Trophy} />
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">All Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Level</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Points</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Streak</th>
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Tasks</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-2 px-3 font-medium">{u.name}</td>
                    <td className="py-2 px-3 text-muted-foreground">{u.email}</td>
                    <td className="py-2 px-3"><span className={`px-2 py-0.5 rounded-full text-xs ${u.role === "admin" ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>{u.role}</span></td>
                    <td className="py-2 px-3"><LevelBadge level={u.level} size="sm" /></td>
                    <td className="py-2 px-3 font-medium">{u.totalPoints}</td>
                    <td className="py-2 px-3">{u.streakCount}</td>
                    <td className="py-2 px-3">{allTasks.filter(t => t.userId === u.id).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
