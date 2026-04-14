import api from "./client";
import API_ENDPOINTS from "./endpoints";

const fileApi = {
  uploadImage: async ({ files, nama }) =>
    api.postForm(API_ENDPOINTS.FILE.UPLOAD_IMAGE, {
      files,
      nama,
    }),

  upload: async ({ files, nama }) =>
    api.postForm(API_ENDPOINTS.FILE.UPLOAD, {
      files,
      nama,
    }),

  get: async (id) => api.get(API_ENDPOINTS.FILE.GET(id)),
};

export default fileApi;
