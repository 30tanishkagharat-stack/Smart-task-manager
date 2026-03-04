import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type UserRole = "user" | "admin";
export type UserLevel = "Beginner" | "Consistent" | "Achiever" | "Master";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  totalPoints: number;
  level: UserLevel;
  streakCount: number;
  lastActiveDate: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function getLevel(points: number): UserLevel {
  if (points >= 500) return "Master";
  if (points >= 200) return "Achiever";
  if (points >= 50) return "Consistent";
  return "Beginner";
}

const SEED_USERS: (User & { password: string })[] = [
  { id: "1", name: "Alice Johnson", email: "alice@demo.com", password: "password", role: "user", totalPoints: 320, level: "Achiever", streakCount: 12, lastActiveDate: new Date().toISOString().split("T")[0] },
  { id: "2", name: "Bob Smith", email: "bob@demo.com", password: "password", role: "user", totalPoints: 85, level: "Consistent", streakCount: 5, lastActiveDate: new Date().toISOString().split("T")[0] },
  { id: "3", name: "Admin", email: "admin@demo.com", password: "admin123", role: "admin", totalPoints: 0, level: "Beginner", streakCount: 0, lastActiveDate: new Date().toISOString().split("T")[0] },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<(User & { password: string })[]>(() => {
    const stored = localStorage.getItem("taskmanager_users");
    return stored ? JSON.parse(stored) : SEED_USERS;
  });
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("taskmanager_current");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => { localStorage.setItem("taskmanager_users", JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem("taskmanager_current", JSON.stringify(user)); }, [user]);

  const login = useCallback((email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) { const { password: _, ...userData } = found; setUser(userData); return true; }
    return false;
  }, [users]);

  const signup = useCallback((name: string, email: string, password: string) => {
    if (users.find(u => u.email === email)) return false;
    const newUser = { id: crypto.randomUUID(), name, email, password, role: "user" as UserRole, totalPoints: 0, level: "Beginner" as UserLevel, streakCount: 0, lastActiveDate: new Date().toISOString().split("T")[0] };
    setUsers(prev => [...prev, newUser]);
    const { password: _, ...userData } = newUser;
    setUser(userData);
    return true;
  }, [users]);

  const logout = useCallback(() => { setUser(null); }, []);

  const updateUser = useCallback((updated: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updated } : null);
    setUsers(prev => prev.map(u => u.id === user?.id ? { ...u, ...updated } : u));
  }, [user?.id]);

  return (
    <AuthContext.Provider value={{ user, users: users.map(({ password: _, ...u }) => u), login, signup, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
