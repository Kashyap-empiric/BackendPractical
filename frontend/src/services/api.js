import axios from "axios"

const API = axios.create({
    baseURL: "https://khz5bstr-8080.inc1.devtunnels.ms/api",
    withCredentials: true
});

API.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if(error.response.status === 401 && !originalRequest._retry) { 
        originalRequest._retry = true;
        try {
            await API.post("http://localhost:8080/api/refresh", {}, { withCredentials: true });
            console.log("Token refreshed successfully");
            return API(originalRequest);
        } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            window.location.href = "/login";
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});

export default API;