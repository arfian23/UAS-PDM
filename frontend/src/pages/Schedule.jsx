import { useEffect, useState } from "react";
import TaskModal from "../components/TaskModal";
import {
  getTasks,
  deleteTask,
  updateTask,
} from "../services/taskService";

export default function Schedule() {

  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

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

  async function handleDelete(id) {

    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus jadwal ini?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTask(id);
      loadTasks();
    } catch (err) {
      console.error(err);
      window.alert("Gagal menghapus data.");
    }
  }

  async function handleComplete(task) {

    const confirmComplete = window.confirm(
      `Tandai jadwal "${task.title}" sebagai selesai?`
    );

    if (!confirmComplete) return;

    try {
      await updateTask(task.id, {
        ...task,
        status: "Completed",
      });
      loadTasks();
    } catch (err) {
      console.error(err);
      window.alert("Gagal memperbarui status.");
    }
  }

  function handleEdit(task) {
    setEditTask(task);
    setOpenModal(true);
  }

  function handleAdd() {
    setEditTask(null);
    setOpenModal(true);
  }

  function closeModal() {
    setOpenModal(false);
    setEditTask(null);
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold text-white">
          📅 Jadwal Saya
        </h1>

        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Tambah Jadwal
        </button>

      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg">

        <table className="w-full text-white">

          <thead className="bg-slate-700">

            <tr>

              <th className="p-4 text-left">
                Judul
              </th>

              <th>
                Tanggal
              </th>

              <th>
                Mulai
              </th>

              <th>
                Selesai
              </th>

              <th>
                Durasi
              </th>

              <th>
                Prioritas
              </th>

              <th>
                Status
              </th>

              <th>
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {tasks.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="text-center py-8 text-gray-400"
                >
                  Belum ada jadwal.
                </td>

              </tr>

            ) : (

              tasks.map((task) => (

                <tr
                  key={task.id}
                  className="border-b border-slate-700 hover:bg-slate-700 transition"
                >

                  <td className="p-4">
                    {task.title}
                  </td>

                  <td>
                    {task.task_date}
                  </td>

                  <td>
                    {task.start_time}
                  </td>

                  <td>
                    {task.end_time}
                  </td>

                  <td>
                    {task.duration} menit
                  </td>

                  <td>

                    <span
                      className={
                        task.priority === "High"
                          ? "text-red-400"
                          : task.priority === "Medium"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }
                    >
                      {task.priority}
                    </span>

                  </td>

                  <td>

                    <span
                      className={
                        task.status === "Completed"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }
                    >
                      {task.status}
                    </span>

                  </td>

                  <td>

                    <div className="flex gap-2 justify-center">

                      {task.status !== "Completed" && (
                        <button
                          onClick={() => handleComplete(task)}
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                        >
                          Selesaikan
                        </button>
                      )}

                      <button
                        onClick={() => handleEdit(task)}
                        className="bg-amber-500 hover:bg-amber-600 px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(task.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                      >
                        Hapus
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      <TaskModal
        open={openModal}
        onClose={closeModal}
        onSuccess={loadTasks}
        editTask={editTask}
      />

    </div>
  );

}