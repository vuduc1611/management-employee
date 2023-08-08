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
  create: (req) => {
    const url = `/employees`;
    return axiosClient.post(url, { req });
  },
  update: (req) => {
    const url = "/employees";
    return axiosClient.put(url, { req });
  },
  deleteOne: (id) => {
    const url = `/employees/${id}`;
    return axiosClient.delete(url);
  },
  deleteMany: (ids) => {
    // const url = "/employees";
    const url = `http://localhost:8080/api/employees/many?ids=${ids}`;
    return axiosClient.delete(url);
  },
  findByDept: (id) => {
    const url = `http://localhost:8080/api/employees/many?ids=${ids}`;
  },
};
export default employeeApi;
