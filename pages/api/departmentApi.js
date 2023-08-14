import axiosClient from "./axiosClient";

// url: localhost:3000/api/departments

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
    return axiosClient.post(url, { req });
  },
  update: (req) => {
    const url = "/departments";
    return axiosClient.put(url, { req });
  },
  deleteOne: (id) => {
    const url = `/departments/${id}`;
    return axiosClient.delete(url);
  },
};
export default departmentApi;
