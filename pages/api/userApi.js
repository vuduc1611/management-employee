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

  deleteOne: async (id) => {
    const url = `/user/${id}`;
    return axiosClient.delete(url);
  },
  sendEmail: async (req) => {
    const url = `/user/forgetPassword`;
    return axiosClient.post(url, JSON.stringify(req));
  },

  changePassword: async (req) => {
    const url = `/user/changePassword`;
    return axiosClient.put(url, JSON.stringify(req));
  },
};

export default userApi;
