import axios from "axios";

// Create a new axios instance
const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://frank-cardinal-smooth.ngrok-free.app",
  timeout: 5000,
});

// Set the default headers for the api client
const defaultHeaders = {
  "Content-Type": "application/json",
};

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (!config.headers["Content-Type"]) {
      config.headers = {
        ...defaultHeaders,
        ...config.headers,
      };
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("HTTP Error:", error);
    return Promise.reject(error.response || error.message);
  }
);

// Function to url encode data
const urlEncode = (data) => {
  return Object.entries(data)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};

// Export the apiService
export const apiService = {
  get: (url, params = {}) => apiClient.get(url, { params }),
  post: (url, data, headers = {}) => apiClient.post(url, data, { headers }),
  postForm: (url, data) =>
    apiClient.post(url, urlEncode(data), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Set the content type to form data
      },
    }),
  put: (url, data) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url),
};
