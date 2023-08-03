import axios from "axios";

export const PositionService = {
  async getPositions() {
    const res = axios.get("http://localhost:8080/api/positions");
    return await res;
  },
};
