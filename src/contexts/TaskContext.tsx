import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth, getLevel } from "./AuthContext";

export type TaskStatus = "pending" | "in-progress" | "completed";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  reminderTime: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Reward {
  id: string;
  userId: string;
  pointsEarned: number;
  date: string;
  taskTitle: string;
}

interface TaskContextType {
  tasks: Task[];
  rewards: Reward[];
  addTask: (task: Omit<Task, "id" | "userId" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => { points: number; message: string };
  allTasks: Task[];
  allRewards: Reward[];
}

const MOTIVATIONAL_MESSAGES = [
  "🎉 Amazing work! Keep the momentum going!",
  "🌟 You're on fire! Another task conquered!",
  "💪 Consistency is key, and you're nailing it!",
  "🚀 Unstoppable! Your productivity is soaring!",
  "✨ Great job! Every completed task brings you closer to your goals!",
  "🏆 Champion move! You're building great habits!",
  "🎯 Bullseye! Task completed with precision!",
  "⚡ Lightning fast! You're crushing it today!",
];

const TaskContext = createContext<TaskContextType | null>(null);

const SEED_TASKS: Task[] = [
  { id: "t1", userId: "1", title: "Complete project report", description: "Finalize the Q4 project report", dueDate: new Date().toISOString().split("T")[0], reminderTime: "09:00", status: "pending", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "t2", userId: "1", title: "Team standup meeting", description: "Daily standup at 10 AM", dueDate: new Date().toISOString().split("T")[0], reminderTime: "10:00", status: "completed", createdAt: new Date(Date.now() - 172800000).toISOString(), completedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "t3", userId: "1", title: "Review pull requests", description: "Review pending PRs on GitHub", dueDate: new Date().toISOString().split("T")[0], reminderTime: "14:00", status: "in-progress", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "t4", userId: "2", title: "Study for exam", description: "Chapter 5-8 review", dueDate: new Date().toISOString().split("T")[0], reminderTime: "08:00", status: "pending", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "t5", userId: "2", title: "Gym workout", description: "Leg day routine", dueDate: new Date().toISOString().split("T")[0], reminderTime: "17:00", status: "pending", createdAt: new Date(Date.now() - 86400000).toISOString() },
];

const SEED_REWARDS: Reward[] = [
  { id: "r1", userId: "1", pointsEarned: 10, date: new Date(Date.now() - 86400000).toISOString(), taskTitle: "Team standup meeting" },
  { id: "r2", userId: "1", pointsEarned: 10, date: new Date(Date.now() - 172800000).toISOString(), taskTitle: "Code review" },
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user, updateUser } = useAuth();

  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem("taskmanager_tasks");
    return stored ? JSON.parse(stored) : SEED_TASKS;
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const stored = localStorage.getItem("taskmanager_rewards");
    return stored ? JSON.parse(stored) : SEED_REWARDS;
  });

  useEffect(() => { localStorage.setItem("taskmanager_tasks", JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem("taskmanager_rewards", JSON.stringify(rewards)); }, [rewards]);

  const userTasks = tasks.filter(t => t.userId === user?.id);
  const userRewards = rewards.filter(r => r.userId === user?.id);

  const addTask = useCallback((task: Omit<Task, "id" | "userId" | "createdAt">) => {
    if (!user) return;
    setTasks(prev => [...prev, { ...task, id: crypto.randomUUID(), userId: user.id, createdAt: new Date().toISOString() }]);
  }, [user]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const completeTask = useCallback((id: string) => {
    if (!user) return { points: 0, message: "" };
    const task = tasks.find(t => t.id === id);
    if (!task) return { points: 0, message: "" };

    const points = 10;
    const newTotal = user.totalPoints + points;
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const newStreak = user.lastActiveDate === yesterday || user.lastActiveDate === today ? user.streakCount + (user.lastActiveDate === today ? 0 : 1) : 1;

    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "completed" as const, completedAt: new Date().toISOString() } : t));
    setRewards(prev => [...prev, { id: crypto.randomUUID(), userId: user.id, pointsEarned: points, date: new Date().toISOString(), taskTitle: task.title }]);
    updateUser({ totalPoints: newTotal, level: getLevel(newTotal), streakCount: newStreak, lastActiveDate: today });

    const message = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    return { points, message };
  }, [user, tasks, updateUser]);

  return (
    <TaskContext.Provider value={{ tasks: userTasks, rewards: userRewards, addTask, updateTask, deleteTask, completeTask, allTasks: tasks, allRewards: rewards }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
};
