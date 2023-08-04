import axiosClient from "./axiosClient";

// api/employeeApi.js
const employeeApi = {
  getAll: (params) => {
    const url = "/employees";
    return axiosClient.get(url, { params });
  },
  get: (id) => {
    const url = `/employees/${id}`;
    return axiosClient.get(url);
  },
};
export default employeeApi;
