# Daily Spark

Build a full-stack web application called "Smart Daily Task Manager with Reward System". This is a software-only capstone project focused on productivity, time management, and user motivation through gamification.

Purpose:
To help users manage daily tasks efficiently by setting reminders, receiving alerts, tracking completion status, and earning rewards/points to stay motivated.

Core Features:
1. User authentication (signup, login, logout).
2. Personalized dashboard after login.
3. Create, edit, delete daily tasks.
4. Set date and time reminders for each task.
5. Real-time alert/notification system when task time arrives.
6. Mark task as completed.
7. Reward system: users earn points for each completed task.
8. Level system (Beginner, Consistent, Achiever, Master) based on points.
9. Daily streak tracking and streak counter.
10. Progress charts (tasks completed per day/week).
11. Motivational message popup after task completion.
12. Admin panel to monitor overall system usage.

User Flow:
- User registers or logs in.
- User adds tasks with deadlines and reminder times.
- System sends notification at scheduled time.
- User marks task as completed.
- System awards points and updates streak and level.
- User views progress analytics in dashboard.

Data Model:
- Users (id, name, email, password, role, total_points, level, streak_count)
- Tasks (id, user_id, title, description, due_date, reminder_time, status)
- Rewards (id, user_id, points_earned, date)
- Notifications (id, user_id, task_id, message, sent_at)

Design Preferences:
- Modern clean UI.
- Soft gradient background (blue and purple tones).
- Responsive design for mobile and desktop.
- Sidebar dashboard layout.
- Simple gamified badges for achievements.

Include backend, database, authentication setup, seeded sample users and tasks for demo purposes. The application should be fully functional and suitable for final year software engineering project demonstration.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://levelfy-tasks.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/93a0f2b3-42bb-4f27-a3ba-e81d0424c985).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
