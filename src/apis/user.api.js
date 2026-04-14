import api from "./client";
import API_ENDPOINTS from "./endpoints";

const userApi = {
  getById: async (id) => api.get(API_ENDPOINTS.USER.GET_BY_ID(id)),

  getMyself: async () => api.get(API_ENDPOINTS.USER.ME),

  getAll: async ({ page = 1, limit = 10, search = "", role = "" }) =>
    api.get(API_ENDPOINTS.USER.GET_ALL, {
      params: { page, limit, search, role },
    }),

  createUser: async ({ name, email, password, role, gambar = "" }) =>
    api.post(API_ENDPOINTS.USER.CREATE, {
      name,
      email,
      password,
      role,
      gambar,
    }),

  updateUser: async (id, { name, email, gambar }) =>
    api.put(API_ENDPOINTS.USER.UPDATE(id), {
      name,
      email,
      gambar,
    }),

  deleteUser: async (id) => api.delete(API_ENDPOINTS.USER.DELETE(id)),
};

export default userApi;
