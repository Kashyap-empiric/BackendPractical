import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 &&!originalRequest._retry && !originalRequest.url.includes("/refresh") && !originalRequest.url.includes("/authcheck")) {
      originalRequest._retry = true;

      try {
        await API.post("/refresh");
        console.log("Token refreshed successfully");
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default API;
