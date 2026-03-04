import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient?: boolean;
}

export function StatsCard({ title, value, subtitle, icon: Icon, gradient }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 shadow-card ${gradient ? "gradient-primary text-primary-foreground" : "bg-card"}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${gradient ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{title}</p>
          <p className="text-3xl font-display font-bold mt-1">{value}</p>
          {subtitle && <p className={`text-xs mt-1 ${gradient ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient ? "bg-primary-foreground/20" : "gradient-card"}`}>
          <Icon className={`w-5 h-5 ${gradient ? "" : "text-primary"}`} />
        </div>
      </div>
    </motion.div>
  );
}
