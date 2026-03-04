import { motion } from "framer-motion";
import { Task } from "@/contexts/TaskContext";
import { CheckCircle2, Clock, Edit, Trash2, Circle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  pending: { icon: Circle, label: "Pending", className: "bg-muted text-muted-foreground" },
  "in-progress": { icon: Loader, label: "In Progress", className: "bg-secondary/15 text-secondary" },
  completed: { icon: CheckCircle2, label: "Completed", className: "bg-success/15 text-success" },
};

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
}

export function TaskCard({ task, onEdit, onDelete, onComplete }: TaskCardProps) {
  const status = STATUS_CONFIG[task.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-card rounded-xl p-4 shadow-card border transition-all hover:shadow-glow/30 ${task.status === "completed" ? "opacity-75" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-medium truncate ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            <Badge variant="outline" className={status.className}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.dueDate} at {task.reminderTime}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {task.status !== "completed" && onComplete && (
            <Button size="icon" variant="ghost" onClick={onComplete} className="text-success hover:text-success hover:bg-success/10 h-8 w-8">
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          )}
          {onEdit && (
            <Button size="icon" variant="ghost" onClick={onEdit} className="h-8 w-8">
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button size="icon" variant="ghost" onClick={onDelete} className="text-destructive hover:text-destructive h-8 w-8">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
