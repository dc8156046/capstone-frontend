import { apiService } from "./http"; // Import the apiService from services/http.js

// Define the userAPI object
export const userAPI = {
  login: (email, password) =>
    apiService.postForm("/auth/token", { username: email, password: password }),
  getUsers: () => apiService.get("/users/"),
  addUser: (data) => apiService.post("/users/", data),
  updateUser: (id, data) => apiService.put(`/users/${id}`, data),
  deleteUser: (id) => apiService.delete(`/users/${id}`),
  signUp: (email, password, companyName) => 
    apiService.postForm("/auth/signup", { username: email, password: password, company: companyName}),
  forgotPassword: (email) =>
    apiService.postForm("/auth/forgot-password", { username: email}),
};
