import { DashboardLayout } from "@/components/DashboardLayout";
import { LevelBadge } from "@/components/LevelBadge";
import { useAuth, UserLevel } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { Trophy, Star, Flame, Target } from "lucide-react";
import { motion } from "framer-motion";

const LEVELS: { level: UserLevel; minPoints: number; icon: typeof Star }[] = [
  { level: "Beginner", minPoints: 0, icon: Target },
  { level: "Consistent", minPoints: 50, icon: Star },
  { level: "Achiever", minPoints: 200, icon: Trophy },
  { level: "Master", minPoints: 500, icon: Flame },
];

export default function Rewards() {
  const { user } = useAuth();
  const { rewards } = useTasks();

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-display font-bold">Rewards & Achievements</h1>

        <div className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold">{user.totalPoints} points</p>
              <LevelBadge level={user.level} />
            </div>
          </div>

          <h3 className="font-display font-semibold mb-3">Level Progression</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {LEVELS.map((l, i) => {
              const achieved = user.totalPoints >= l.minPoints;
              const Icon = l.icon;
              return (
                <motion.div
                  key={l.level}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-xl p-4 text-center border-2 transition-all ${achieved ? "border-primary gradient-card" : "border-border opacity-50"}`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${achieved ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="font-medium text-sm">{l.level}</p>
                  <p className="text-xs text-muted-foreground">{l.minPoints} pts</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h3 className="font-display font-semibold mb-4">Recent Rewards</h3>
          {rewards.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">Complete tasks to earn rewards!</p>
          ) : (
            <div className="space-y-2">
              {rewards.slice().reverse().slice(0, 20).map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{r.taskTitle}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-sm font-bold text-gradient">+{r.pointsEarned} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
