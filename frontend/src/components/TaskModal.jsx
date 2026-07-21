import { useEffect, useState } from "react";
import { createTask, updateTask } from "../services/taskService";

export default function TaskModal({
  open,
  onClose,
  onSuccess,
  editTask = null,
}) {
  const emptyForm = {
    title: "",
    description: "",
    task_date: "",
    start_time: "",
    end_time: "",
    duration: 0,
    priority: "Medium",
    status: "Pending",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editTask) {
      setForm(editTask);
    } else {
      setForm(emptyForm);
    }
  }, [editTask, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  function calculateDuration(start, end) {
    if (!start || !end) return 0;

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    const startMinute = sh * 60 + sm;
    const endMinute = eh * 60 + em;

    return Math.max(endMinute - startMinute, 0);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      duration: calculateDuration(
        form.start_time,
        form.end_time
      ),
    };

    try {
      if (editTask) {
        await updateTask(editTask.id, payload);
      } else {
        await createTask(payload);
      }

      onSuccess();
      onClose();

      setForm(emptyForm);
    } catch (err) {
      console.error(err);
      window.alert("Gagal menyimpan data.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-slate-900 w-[550px] rounded-xl p-6">

        <h2 className="text-2xl font-bold text-white mb-6">

          {editTask ? "✏️ Edit Jadwal" : "➕ Tambah Jadwal"}

        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="title"
            placeholder="Judul"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <textarea
            name="description"
            placeholder="Deskripsi"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="date"
            name="task_date"
            value={form.task_date}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <div className="grid grid-cols-2 gap-4">

            <input
              type="time"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              required
              className="p-3 rounded bg-slate-800 text-white"
            />

            <input
              type="time"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              required
              className="p-3 rounded bg-slate-800 text-white"
            />

          </div>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          >

            <option value="High">High</option>

            <option value="Medium">Medium</option>

            <option value="Low">Low</option>

          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          >

            <option value="Pending">Pending</option>

            <option value="Completed">Completed</option>

          </select>

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editTask ? "Update" : "Simpan"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}