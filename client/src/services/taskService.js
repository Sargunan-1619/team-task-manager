import api from './api';

export async function getTasks() {
  const response = await api.get('/tasks');
  return response.data;
}

export async function createTask(payload, userId) {
  const response = await api.post('/tasks', {
    ...payload,
    assignedTo: userId || payload?.assignedTo || undefined,
  });
  return response.data;
}

export async function updateTask(id, payload) {
  const response = await api.patch(`/tasks/${id}`, payload);
  return response.data;
}

export async function updateTaskStatus(id, status) {
  const response = await api.patch(`/tasks/${id}/status`, { status });
  return response.data;
}

export async function deleteTask(id) {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
}
