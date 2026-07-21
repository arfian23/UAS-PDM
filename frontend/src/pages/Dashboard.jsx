import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import DashboardCard from "../components/DashboardCard";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  }

  const totalTask = tasks.length;

  const pendingTask = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const completedTask = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const today = new Date().toISOString().split("T")[0];

  const todayTask = tasks.filter(
    (task) => task.task_date === today
  ).length;

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold text-white">
          📊 Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Selamat datang di Smart Scheduler AI
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <DashboardCard
          title="Total Task"
          value={totalTask}
          icon="📋"
          color="text-cyan-400"
        />

        <DashboardCard
          title="Pending"
          value={pendingTask}
          icon="🟡"
          color="text-yellow-400"
        />

        <DashboardCard
          title="Completed"
          value={completedTask}
          icon="✅"
          color="text-green-400"
        />

        <DashboardCard
          title="Hari Ini"
          value={todayTask}
          icon="🔥"
          color="text-red-400"
        />

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-white mb-5">
          🤖 AI Insight
        </h2>

        <div className="space-y-3 text-slate-300">

          <p>
            • Total jadwal Anda saat ini adalah <b>{totalTask}</b>.
          </p>

          <p>
            • Masih terdapat <b>{pendingTask}</b> task yang belum selesai.
          </p>

          <p>
            • Sebanyak <b>{completedTask}</b> task telah diselesaikan.
          </p>

          <p>
            • Hari ini terdapat <b>{todayTask}</b> jadwal.
          </p>

          <p className="text-cyan-400 mt-5">
            AI Recommendation:
          </p>

          <p>
            Prioritaskan penyelesaian seluruh task dengan status
            <b> Pending </b>
            sebelum menambahkan jadwal baru agar beban pekerjaan tetap seimbang.
          </p>

        </div>

      </div>

    </div>
  );
}