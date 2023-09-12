import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    accept: "*/*",
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) =>
    queryString.stringify(
      params,
      {
        skipNull: true,
      },
      { arrayFormat: "comma" }
    ),
});
axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  config.headers["Authorization"] = `Bearer ${token}`;

  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error.response.data;
  }
);
export default axiosClient;
