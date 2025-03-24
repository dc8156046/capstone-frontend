import { apiService } from "./http"; // Import the apiService from services/http.js

// Define the taskDetailAPI object
export const taskDetailAPI = {
  getUser: (id) => apiService.get(`/users/${id}`),
  getProjectDetail: (id) => apiService.post(`/projects/${id}`),
  updateProject: (id, data) => apiService.put(`/projects/${id}`, data),
  deleteProject: (id) => apiService.delete(`/projects/${id}`),
  addTask: (id, data) => apiService.post(`/projects/${id}/tasks`, data),
  updateTask: (id, taskId, data) =>
    apiService.put(`/projects/${id}/tasks/${taskId}`, data),
  deleteTask: (id, taskId) =>
    apiService.delete(`/projects/${id}/tasks/${taskId}`),
  sendEmail: (id, data) => apiService.post(`/projects/${id}/send-email`, data),
  getCategory: () => apiService.post("/tasks/categories"),
  getSubtask: (id) => apiService.post(`/tasks/${id}/subtasks`),
  createSubtask: (id, data) => apiService.post(`/tasks/${id}/subtasks`, data),
};
