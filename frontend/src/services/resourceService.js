import api from "./api";

export const resourceService = {
  getAll: (params) => api.get("/resources", { params }).then((r) => r.data),
  getById: (id) => api.get(`/resources/${id}`).then((r) => r.data),
  create: (data) => api.post("/resources", data).then((r) => r.data),
  update: (id, data) => api.put(`/resources/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/resources/${id}`),
  uploadImage: (id, file) => {
    const form = new FormData();
    form.append("file", file);
    return api
      .post(`/resources/${id}/images`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
  deleteImage: (id, imageUrl) =>
    api
      .delete(`/resources/${id}/images`, { params: { imageUrl } })
      .then((r) => r.data),
};
