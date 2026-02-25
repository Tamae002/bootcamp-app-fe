import api from "./client";
import API_ENDPOINTS from "./endpoints";

const statisticsApi = {
  getStatistics: () => api.get(API_ENDPOINTS.STATISTICS.GET),
};

export default statisticsApi;
