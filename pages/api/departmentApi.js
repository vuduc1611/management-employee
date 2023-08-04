import axiosClient from "./axiosClient";

// url: localhost:3000/api/departments

const departmentApi = {
  getAll: () => {
    const url = "/departments";
    return axiosClient.get(url);
  },
  get: (id) => {
    const url = `/departments/${id}`;
    return axiosClient.get(url);
  },
};
export default departmentApi;
