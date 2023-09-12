import axiosClient from "./axiosClient";

// url: localhost:8080/api/departments

const departmentApi = {
  getAll: async () => {
    const url = "/departments";
    return await axiosClient.get(url);
  },
  findByDept: async (id) => {
    const url = `/departments/${id}`;
    return await axiosClient.get(url);
  },

  create: (req) => {
    const url = `/departments`;
    return axiosClient.post(url, JSON.stringify(req));
  },
  update: (req) => {
    const url = "/departments";
    return axiosClient.put(url, JSON.stringify(req));
  },
  deleteOne: (id) => {
    const url = `/departments/${id}`;
    return axiosClient.delete(url);
  },
  deleteMany: (ids) => {
    const url = `/departments/many?ids=${ids}`;
    return axiosClient.delete(url);
  },
  // findQtyEmployeesByDep: () => {
  //   const url = `/department/count`;
  //   return axiosClient.get(url);
  // },
};
export default departmentApi;
