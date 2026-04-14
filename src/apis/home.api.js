import api from "./client";
import API_ENDPOINTS from "./endpoints";

const homeApi = {
  getHomeData: () => api.get(API_ENDPOINTS.HOME.GET),
};

export default homeApi;
