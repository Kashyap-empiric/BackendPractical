import axios from "axios"

const API = axios.create({
    baseURL: "http://localhost:8080/api"
})

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post(
        "http://localhost:5000/api/auth/refresh",
        { refreshToken }
      );
      const newAccessToken = response.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return API(originalRequest);
    }
    return Promise.reject(error);
  }
);


export default API;