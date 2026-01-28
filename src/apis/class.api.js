import api from "./client";
import API_ENDPOINTS from "./endpoints";

const classApi = {
  getAll: ({ page = 1, limit = 10 }) => api.get(API_ENDPOINTS.CLASS.GET_ALL, { params: { page, limit }}),

  getById: (id) => api.get(API_ENDPOINTS.CLASS.GET_BY_ID(id)),

  create: ({
    nama_kelas,
    deskripsi,
    gambar,
    tanggal_mulai,
    tanggal_berakhir,
    added_users = [],
  }) =>
    api.post(API_ENDPOINTS.CLASS.CREATE, {
      nama_kelas,
      deskripsi,
      gambar,
      tanggal_mulai,
      tanggal_berakhir,
      added_users,
    }),

  delete: (id) => api.delete(API_ENDPOINTS.CLASS.DELETE(id)),

  update: (
    id,
    {
      nama_kelas,
      deskripsi,
      gambar,
      tanggal_mulai,
      tanggal_berakhir,
      added_users = [],
      removed_users = [],
    },
  ) => api.patch(API_ENDPOINTS.CLASS.UPDATE(id), {
    nama_kelas,
    deskripsi,
    gambar,
    tanggal_mulai,
    tanggal_berakhir,
    added_users,
    removed_users,
  }),
};

export default classApi;
