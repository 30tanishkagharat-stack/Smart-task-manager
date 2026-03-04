import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { TaskCard } from "@/components/TaskCard";
import { LevelBadge } from "@/components/LevelBadge";
import { MotivationalPopup } from "@/components/MotivationalPopup";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { ListTodo, CheckCircle2, Flame, Trophy, TrendingUp } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, completeTask } = useTasks();
  const [popup, setPopup] = useState<{ open: boolean; message: string; points: number }>({ open: false, message: "", points: 0 });

  if (!user) return null;

  const pendingTasks = tasks.filter(t => t.status !== "completed");
  const completedToday = tasks.filter(t => t.status === "completed" && t.completedAt?.startsWith(new Date().toISOString().split("T")[0])).length;

  const handleComplete = (id: string) => {
    const result = completeTask(id);
    setPopup({ open: true, ...result });
  };

  const levelProgress = user.level === "Beginner" ? (user.totalPoints / 50) * 100
    : user.level === "Consistent" ? ((user.totalPoints - 50) / 150) * 100
    : user.level === "Achiever" ? ((user.totalPoints - 200) / 300) * 100
    : 100;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Welcome back, {user.name.split(" ")[0]}! 👋</h1>
          <p className="text-muted-foreground mt-1">Here's your productivity overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Tasks" value={tasks.length} icon={ListTodo} subtitle={`${pendingTasks.length} pending`} />
          <StatsCard title="Completed Today" value={completedToday} icon={CheckCircle2} gradient />
          <StatsCard title="Day Streak" value={user.streakCount} icon={Flame} subtitle="Keep it up!" />
          <StatsCard title="Total Points" value={user.totalPoints} icon={Trophy} subtitle={user.level} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-semibold">Upcoming Tasks</h2>
              <span className="text-sm text-muted-foreground">{pendingTasks.length} remaining</span>
            </div>
            {pendingTasks.length === 0 ? (
              <div className="bg-card rounded-xl p-8 text-center shadow-card">
                <CheckCircle2 className="w-12 h-12 mx-auto text-success mb-3" />
                <p className="font-medium">All tasks completed!</p>
                <p className="text-sm text-muted-foreground">Great work today!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.slice(0, 5).map(task => (
                  <TaskCard key={task.id} task={task} onComplete={() => handleComplete(task.id)} />
                ))}
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-2xl p-5 shadow-card space-y-4"
          >
            <h3 className="font-display font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Your Progress
            </h3>
            <div className="text-center py-4">
              <LevelBadge level={user.level} size="lg" />
              <p className="text-3xl font-display font-bold mt-3">{user.totalPoints}</p>
              <p className="text-sm text-muted-foreground">total points</p>
            </div>
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Level progress</span>
                <span>{Math.min(100, Math.round(levelProgress))}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, levelProgress)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full gradient-primary rounded-full"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Flame className="w-5 h-5 text-streak" />
              <div>
                <p className="text-sm font-medium">{user.streakCount} day streak</p>
                <p className="text-xs text-muted-foreground">Don't break the chain!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <MotivationalPopup open={popup.open} onClose={() => setPopup(p => ({ ...p, open: false }))} message={popup.message} points={popup.points} />
    </DashboardLayout>
  );
}
