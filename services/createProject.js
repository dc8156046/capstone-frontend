// CreateProject.js
import { apiService } from "./http";

export const projectAPI = {
  // Create a new project
  createProject: (projectData) => apiService.post('/projects', projectData),
  
  // Get a specific project by ID
  getProject: (id) => apiService.get(`/projects/${id}`),
  
  // Update an existing project
  updateProject: (id, data) => apiService.put(`/projects/${id}`, data),
  
  // Delete a project
  deleteProject: (id) => apiService.delete(`/projects/${id}`),
  
  // Get all projects with optional query parameters
  getAllProjects: (params) => apiService.get('/projects', params),
  
  // Additional methods as needed for your application
  // For example:
  assignUserToProject: (projectId, userId) => 
    apiService.post(`/projects/${projectId}/assign`, { userId }),
    
  completeProject: (projectId) => 
    apiService.put(`/projects/${projectId}/complete`),
};