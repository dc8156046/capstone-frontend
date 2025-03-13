// CreateProject.js
import { apiService } from "./http";

export const projectAPI = {
  // Create a new project
  createProject: (projectData) => apiService.post('/projects', projectData),
  
  // Get a specific project by ID
  getProject: (id) => apiService.post(`/projects/${id}`),
  
  // Update an existing project
  updateProject: (id, data) => apiService.put(`/projects/${id}`, data),
  
  // Delete a project
  deleteProject: (id) => apiService.delete(`/projects/${id}`),
  
  // Get all projects with optional query parameters
  getAllProjects: () => apiService.post('/projects', {}),

  //Get all tasks
  getAllTasks: () => apiService.post('/tasks/', {}),

  getAllProvinces: () => apiService.post('/provinces/', {}),
  
  // Get cities by province
  getCitiesByProvince: (province_id) => apiService.post(`/provinces/${province_id}/cities`, {}),
  
  completeProject: (projectId) => 
    apiService.put(`/projects/${projectId}/complete`),
};