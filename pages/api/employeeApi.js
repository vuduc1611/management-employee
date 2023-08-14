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
    const url = `/employees/many?ids=${ids}`;
    return axiosClient.delete(url);
  },
  // findByDept: (id) => {
  //   const url = `/departments/${id}`;
  //   return axiosClient.get(url);
  // },
  findByDeptAndPos: (idDept, idPos) => {
    const url = `/employees/dept/${idDept}/pos/${idPos}`;
    return axiosClient.get(url);
  },
};
export default employeeApi;
