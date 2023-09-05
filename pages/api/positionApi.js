import axiosClient from "./axiosClient";

// url: localhost:3000/api/positions
const positionApi = {
  getAll: async () => {
    const url = "/positions";
    return await axiosClient.get(url);
  },
  get: (id) => {
    const url = `/positions/${id}`;
    return axiosClient.get(url);
  },
};
export default positionApi;
