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
        // console.log("check response", response);
        if (response.accessToken) {
          // localStorage.setItem("token", JSON.stringify(response.accessToken));
          localStorage.setItem("token", response.accessToken);
        }
        return response;
      });
  },

  // logout: () => {
  //   return localStorage.removeItem("token");
  // },

  // getCurrentUser: () => {
  //   return JSON.parse(localStorage.getItem("user"));
  // },
};

export default authService;
