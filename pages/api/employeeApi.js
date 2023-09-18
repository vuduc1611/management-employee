import axios from "axios";
import axiosClient from "./axiosClient";
import { authHeader } from "./AuthServices/authHeader";

// api/employeeApi.js
const employeeApi = {
  getAllData: async () => {
    const url = "/employees/all";
    return await axiosClient.get(url);
  },

  getAllPaginator: async (params) => {
    const url = "/employees";
    return await axiosClient.get(url, { params });
  },
  get: async (id) => {
    const url = `/employees/${id}`;
    return await axiosClient.get(url);
  },
  create: async (req) => {
    const url = `/employees`;
    return await axiosClient.post(url, JSON.stringify(req));
    // return await axiosClient.post(url, { req });
  },
  createMany: async (req) => {
    const url = "/employees/many";
    return await axiosClient.post(url, JSON.stringify(req));
  },

  update: async (req) => {
    const url = "/employees";
    return await axiosClient.put(url, JSON.stringify(req));
  },
  deleteOne: async (id) => {
    const url = `/employees/${id}`;
    return await axiosClient.delete(url);
  },
  deleteMany: async (ids) => {
    // const url = "/employees";
    const url = `/employees/many?ids=${ids}`;
    return await axiosClient.delete(url);
  },
  findMany: async (ids) => {
    const url = `/employees/findmany?ids=${ids}`;
    return axiosClient.get(url);
  },
  findByDeptAndPos: (idDept, idPos) => {
    const url = `/employees/dept/${idDept}/pos/${idPos}`;
    return axiosClient.get(url);
  },

  importExcel: async (formData) => {
    return await axiosClient.post(
      `http://localhost:8080/api/excel/upload`,
      formData,
      {
        headers: {
          // Accept: "application/json",
          "content-type": "multipart/form-data",
        },
      }
    );
  },
};
export default employeeApi;
