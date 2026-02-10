import api from "./client";
import API_ENDPOINTS from "./endpoints";

const meetApi = {
  getAll: () => api.get(API_ENDPOINTS.MEET.GET_ALL),

  getById: (id) => api.get(API_ENDPOINTS.MEET.GET_BY_ID(id)),

  create: ({ kelas_id, judul, tanggal, deskripsi_tugas, link_lampiran }) =>
    api.post(API_ENDPOINTS.MEET.CREATE, {
      kelas_id,
      judul,
      tanggal,
      deskripsi_tugas,
      link_lampiran,
    }),

  update: (id, { kelas_id, judul, tanggal, deskripsi_tugas, link_lampiran }) =>
    api.put(API_ENDPOINTS.MEET.UPDATE(id), {
      kelas_id,
      judul,
      tanggal,
      deskripsi_tugas,
      link_lampiran,
    }),

  delete: (id) => api.delete(API_ENDPOINTS.MEET.DELETE(id)),
};

export default meetApi;
