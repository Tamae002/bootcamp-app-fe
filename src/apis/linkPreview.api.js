import api from "./client";
import API_ENDPOINTS from "./endpoints";

const linkPreviewApi = {
  get: async (url) =>
    api.get(API_ENDPOINTS.LINK_PREVIEW.GET, {
      params: {
        url,
      },
    }),
};

export { linkPreviewApi };
