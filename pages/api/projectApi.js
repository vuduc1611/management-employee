import axiosClient from "./axiosClient";

// api/employeeApi.js
const projectApi = {
  getAll: async () => {
    const url = "/projects";
    return await axiosClient.get(url);
  },
  get: async (id) => {
    const url = `/projects/${id}`;
    return await axiosClient.get(url);
  },
  create: async (req) => {
    const url = `/projects`;
    return await axiosClient.post(url, JSON.stringify(req));
  },
  update: async (req) => {
    const url = "/projects";
    return await axiosClient.put(url, JSON.stringify(req));
  },
  deleteOne: async (id) => {
    const url = `/projects/${id}`;
    return await axiosClient.delete(url);
  },
};
export default projectApi;
