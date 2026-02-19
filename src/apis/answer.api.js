import api from "./client";
import API_ENDPOINTS from "./endpoints";

const answerApi = {
  create: (meetId, { file_path, deskripsi }) =>
    api.post(API_ENDPOINTS.ANSWER.CREATE(meetId), {
      file_path,
      deskripsi,
    }),

  grade: (id, { nilai }) =>
    api.patch(API_ENDPOINTS.ANSWER.GRADE(id), { nilai }),
};

export default answerApi;
