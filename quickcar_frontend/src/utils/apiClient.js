import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:9090",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post(
              "http://localhost:9090/api/auth/refresh",
              { token: refreshToken }
            );

            const newAccessToken = refreshResponse.data.token;
            localStorage.setItem("token", newAccessToken);

            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
            localStorage.clear();
            window.location.href = "/login"; 
            return Promise.reject(refreshError);
          }
        } else {
          console.error("No refresh token available.");
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    } else {
      console.error("Axios network error:", error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
