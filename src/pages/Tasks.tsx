import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { MotivationalPopup } from "@/components/MotivationalPopup";
import { useTasks, TaskStatus } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, completeTask } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<typeof tasks[0] | null>(null);
  const [popup, setPopup] = useState<{ open: boolean; message: string; points: number }>({ open: false, message: "", points: 0 });

  const handleSave = (data: { title: string; description: string; dueDate: string; reminderTime: string; status: TaskStatus }) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      toast.success("Task updated");
    } else {
      addTask(data);
      toast.success("Task created");
    }
    setEditingTask(null);
  };

  const handleComplete = (id: string) => {
    const result = completeTask(id);
    setPopup({ open: true, ...result });
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    toast.success("Task deleted");
  };

  const pending = tasks.filter(t => t.status === "pending");
  const inProgress = tasks.filter(t => t.status === "in-progress");
  const completed = tasks.filter(t => t.status === "completed");

  const renderTasks = (list: typeof tasks) => (
    <div className="space-y-3">
      <AnimatePresence>
        {list.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No tasks here</p>
        ) : (
          list.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => { setEditingTask(task); setDialogOpen(true); }}
              onDelete={() => handleDelete(task.id)}
              onComplete={task.status !== "completed" ? () => handleComplete(task.id) : undefined}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">My Tasks</h1>
            <p className="text-muted-foreground">{tasks.length} total tasks</p>
          </div>
          <Button onClick={() => { setEditingTask(null); setDialogOpen(true); }} className="gradient-primary border-0">
            <Plus className="w-4 h-4 mr-2" /> New Task
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({inProgress.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all">{renderTasks(tasks)}</TabsContent>
          <TabsContent value="pending">{renderTasks(pending)}</TabsContent>
          <TabsContent value="in-progress">{renderTasks(inProgress)}</TabsContent>
          <TabsContent value="completed">{renderTasks(completed)}</TabsContent>
        </Tabs>
      </div>

      <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} task={editingTask} onSave={handleSave} />
      <MotivationalPopup open={popup.open} onClose={() => setPopup(p => ({ ...p, open: false }))} message={popup.message} points={popup.points} />
    </DashboardLayout>
  );
}
