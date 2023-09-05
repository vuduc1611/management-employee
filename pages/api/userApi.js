import axiosClient from "./axiosClient";

const userApi = {
  getEmployByUsername: async (username) => {
    const url = `/user/${username}`;
    return axiosClient.get(url);
  },
};

export default userApi;
