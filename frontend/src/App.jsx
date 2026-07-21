import Sidebar from "./components/Sidebar";

import { Routes, Route } from "react-router-dom";

import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Schedule from "./pages/Schedule";
import Settings from "./pages/Settings";
import useNotificationScheduler from "./components/useNotificationScheduler";
import NotificationToasts from "./components/NotificationToasts";

export default function App() {
  const { toasts, dismissToast } = useNotificationScheduler();

  return (
    <div className="flex h-screen bg-slate-950">

      <Sidebar />

      <div className="flex-1 p-8 overflow-auto">

        <Routes>

          <Route path="/" element={<Chat />} />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          
          <Route
            path="/calendar"
            element={<Calendar />}
          />

          <Route
            path="/schedule"
            element={<Schedule />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Routes>

      </div>

      <NotificationToasts toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}