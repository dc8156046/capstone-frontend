import { apiService } from "./http"; // Import the apiService from services/http.js
import axios from "axios";

// Define the taskDetailAPI object
export const taskDetailAPI = {
  getProjectDetail: (id) => apiService.post(`/projects/${id}`),
  updateProject: (id, data) => apiService.put(`/projects/${id}`, data),
  deleteProject: (id) => apiService.delete(`/projects/${id}`),
  addTask: (id, data) => apiService.post(`/projects/${id}/tasks`, data),
  updateTask: (id, data) => apiService.put(`/projects/${id}/tasks`, data),
  deleteTask: (id, taskId) =>
    apiService.delete(`/projects/${id}/tasks?task_id=${taskId}`),
  sendEmail: (id, data) => apiService.post(`/projects/${id}/send-email`, data),
  getCategory: () => apiService.post("/tasks/categories"),
  getSubtask: (id) => apiService.post(`/tasks/${id}/subtasks`),
  createSubtask: (id, data) => apiService.post(`/tasks/${id}/subtasks`, data),
};
