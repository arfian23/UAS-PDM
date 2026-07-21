import api from "./api";

// ==========================
// GET Semua Task
// ==========================
export const getTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

// ==========================
// CREATE Task
// ==========================
export const createTask = async (task) => {
  const response = await api.post("/tasks", task);
  return response.data;
};

// ==========================
// UPDATE Task
// ==========================
export const updateTask = async (id, task) => {
  const response = await api.put(`/tasks/${id}`, task);
  return response.data;
};

// ==========================
// DELETE Task
// ==========================
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};