import axiosClient from "./axiosClient";

// url: localhost:8080/api/departments

const departmentApi = {
  getAll: () => {
    const url = "/departments";
    return axiosClient.get(url);
  },
  findByDept: (id) => {
    const url = `/departments/${id}`;
    return axiosClient.get(url);
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
};
export default departmentApi;
