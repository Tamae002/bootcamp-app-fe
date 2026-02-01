import api from "./client";
import API_ENDPOINTS from "./endpoints";

const fileApi = {
  upload: async (files) =>
    api.postForm(API_ENDPOINTS.FILE.UPLOAD, {
      files,
    }),

  get: async (id) => api.get(API_ENDPOINTS.FILE.GET(id)),
};

export default fileApi;
