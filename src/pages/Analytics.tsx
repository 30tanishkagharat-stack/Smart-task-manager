import { DashboardLayout } from "@/components/DashboardLayout";
import { useTasks } from "@/contexts/TaskContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useMemo } from "react";

const COLORS = ["hsl(245, 58%, 58%)", "hsl(210, 60%, 55%)", "hsl(152, 60%, 45%)"];

export default function Analytics() {
  const { tasks, rewards } = useTasks();

  const weeklyData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });
    return days.map(date => ({
      name: new Date(date).toLocaleDateString("en", { weekday: "short" }),
      completed: tasks.filter(t => t.completedAt?.startsWith(date)).length,
      created: tasks.filter(t => t.createdAt?.startsWith(date)).length,
    }));
  }, [tasks]);

  const statusData = useMemo(() => [
    { name: "Pending", value: tasks.filter(t => t.status === "pending").length },
    { name: "In Progress", value: tasks.filter(t => t.status === "in-progress").length },
    { name: "Completed", value: tasks.filter(t => t.status === "completed").length },
  ], [tasks]);

  const totalPoints = rewards.reduce((s, r) => s + r.pointsEarned, 0);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-display font-bold">Analytics</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-5 shadow-card">
            <h3 className="font-display font-semibold mb-4">Tasks This Week</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 20%, 88%)" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="completed" fill="hsl(245, 58%, 58%)" radius={[4, 4, 0, 0]} name="Completed" />
                <Bar dataKey="created" fill="hsl(210, 60%, 55%)" radius={[4, 4, 0, 0]} name="Created" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-2xl p-5 shadow-card">
            <h3 className="font-display font-semibold mb-4">Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h3 className="font-display font-semibold mb-2">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Tasks", value: tasks.length },
              { label: "Completed", value: tasks.filter(t => t.status === "completed").length },
              { label: "Completion Rate", value: tasks.length ? `${Math.round((tasks.filter(t => t.status === "completed").length / tasks.length) * 100)}%` : "0%" },
              { label: "Points Earned", value: totalPoints },
            ].map(s => (
              <div key={s.label} className="text-center p-3">
                <p className="text-2xl font-display font-bold text-gradient">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
