import axios from "axios";
export const DepartmentService = {
  async getDepartments() {
    const res = axios.get("http://localhost:8080/api/departments");
    return await res;
  },
  // Put employee
  async updateDepartment(req) {
    return await axios.put("http://localhost:8080/api/departments", req);
  },
  // Post employee
  async createDepartment(req) {
    return await axios.post("http://localhost:8080/api/departments", req);
  },
  // delete employee
  async deleteDepartment(id) {
    return await axios.delete(`http://localhost:8080/api/departments/${id}`);
  },

  async deleteDepartments(ids) {
    return await axios.delete(
      "http://localhost:8080/api/departments/many?ids=" + ids
    );
  },
};
