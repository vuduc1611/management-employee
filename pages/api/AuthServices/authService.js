import axiosClient from "../axiosClient";

const authService = {
  register: async (req) => {
    const url = "/auth/signup";
    return await axiosClient.post(url, JSON.stringify(req));
  },

  login: async ({ username, password }) => {
    const url = "/auth/signin";
    return await axiosClient
      .post(url, { username, password })
      .then((response) => {
        if (response.accessToken) {
          localStorage.setItem("token", response.accessToken);
        }
        return response;
      });
  },
};

export default authService;
