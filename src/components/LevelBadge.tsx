import { UserLevel } from "@/contexts/AuthContext";
import { Shield, Star, Award, Crown } from "lucide-react";

const LEVEL_CONFIG: Record<UserLevel, { icon: typeof Shield; color: string; bg: string }> = {
  Beginner: { icon: Shield, color: "text-muted-foreground", bg: "bg-muted" },
  Consistent: { icon: Star, color: "text-secondary", bg: "bg-secondary/10" },
  Achiever: { icon: Award, color: "text-warning", bg: "bg-warning/10" },
  Master: { icon: Crown, color: "text-accent", bg: "bg-accent/10" },
};

export function LevelBadge({ level, size = "md" }: { level: UserLevel; size?: "sm" | "md" | "lg" }) {
  const config = LEVEL_CONFIG[level];
  const Icon = config.icon;
  const sizeClasses = { sm: "px-2 py-0.5 text-xs", md: "px-3 py-1 text-sm", lg: "px-4 py-2 text-base" };
  const iconSizes = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bg} ${config.color} ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      {level}
    </span>
  );
}
