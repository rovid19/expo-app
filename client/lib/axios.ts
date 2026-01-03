import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL;
console.log("API Base URL:", baseURL);

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  console.log(
    "Making request to:",
    (config.baseURL || "") + (config.url || "")
  );
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message);
    if (error.config) {
      console.error(
        "Full URL:",
        (error.config.baseURL || "") + (error.config.url || "")
      );
    }
    return Promise.reject(error);
  }
);

export default api;
