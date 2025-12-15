import api from "./client";
import API_ENDPOINTS from "./endpoints";

const userApi = {
  getMyself: async () =>
    api.get(API_ENDPOINTS.USER.ME),
};

export default userApi;
