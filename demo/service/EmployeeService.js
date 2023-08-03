import axios from "axios";
export const EmployeeService = {
  // Get employees
  async getEmployees() {
    const res = axios.get("http://localhost:8080/api/employees");
    return await res;
  },
  // Put employee
  async updateEmployee(req) {
    return await axios.put("http://localhost:8080/api/employees", req);
  },
  // Post employee
  async createEmployee(req) {
    return await axios.post("http://localhost:8080/api/employees", req);
  },
  // delete employee
  async deleteEmployee(id) {
    return await axios.delete(`http://localhost:8080/api/employees/${id}`);
  },

  async deleteManyEmp(ids) {
    return await axios.delete(
      "http://localhost:8080/api/employees/many?ids=" + ids
    );
  },
};
