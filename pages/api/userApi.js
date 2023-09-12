import axiosClient from "./axiosClient";

const userApi = {
  getEmployByUsername: async (username) => {
    const url = `/user/${username}`;
    return axiosClient.get(url);
  },
  getAll: async () => {
    const url = `/user`;
    return axiosClient.get(url);
  },
  signup: async (req) => {
    const url = `/auth/signup`;
    return axiosClient.post(url, JSON.stringify(req));
  },
  update: async (req) => {
    const url = `/user`;
    return axiosClient.put(url, JSON.stringify(req));
  },
};

export default userApi;
