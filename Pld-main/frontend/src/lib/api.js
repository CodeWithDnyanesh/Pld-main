import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, withCredentials: true });

// ---- Public ----
export const getProjects = async () => (await api.get("/projects")).data;
export const getProject = async (slug) => (await api.get(`/projects/${slug}`)).data;
export const brochureUrl = (slug) => `${API}/projects/${slug}/brochure`;
export const submitEnquiry = async (payload) => (await api.post("/enquiries", payload)).data;

// ---- Auth ----
export const processSession = async (sessionId) =>
  (await api.post("/auth/session", {}, { headers: { "X-Session-ID": sessionId } })).data;
export const getMe = async () => (await api.get("/auth/me")).data;
export const logout = async () => (await api.post("/auth/logout")).data;

// ---- Admin ----
export const adminCreateProject = async (p) => (await api.post("/admin/projects", p)).data;
export const adminUpdateProject = async (id, p) => (await api.put(`/admin/projects/${id}`, p)).data;
export const adminDeleteProject = async (id) => (await api.delete(`/admin/projects/${id}`)).data;
export const adminUploadBrochure = async (id, file) => {
  const fd = new FormData();
  fd.append("file", file);
  return (
    await api.post(`/admin/projects/${id}/brochure`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
};
export const adminGetEnquiries = async () => (await api.get("/admin/enquiries")).data;
export const adminDeleteEnquiry = async (id) => (await api.delete(`/admin/enquiries/${id}`)).data;
