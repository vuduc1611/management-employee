import axiosClient from "./axiosClient";

// url: localhost:3000/api/positions
const positionApi = {
  getAll: async () => {
    const url = "/positions";
    return await axiosClient.get(url);
  },
  get: async (id) => {
    const url = `/positions/${id}`;
    return await axiosClient.get(url);
  },
  create: async (req) => {
    const url = "/positions";
    return await axiosClient.post(url, JSON.stringify(req));
  },
  update: async (req) => {
    const url = "/positions";
    return await axiosClient.put(url, JSON.stringify(req));
  },
  deleteOne: async (id) => {
    const url = `/positions/${id}`;
    return await axiosClient.delete(url);
  },
  deleteMany: async (ids) => {
    const url = `/positions/many?ids=${ids}`;
    return await axiosClient.delete(url);
  },
};
export default positionApi;
