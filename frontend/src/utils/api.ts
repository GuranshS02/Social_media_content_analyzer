import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 2 minutes for OCR processing
});

export const analyzeFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getHistory = async (page = 1, limit = 10) => {
  const response = await api.get(`/history?page=${page}&limit=${limit}`);
  return response.data;
};

export const getAnalysisById = async (id: string) => {
  const response = await api.get(`/history/${id}`);
  return response.data;
};

export const deleteAnalysis = async (id: string) => {
  const response = await api.delete(`/history/${id}`);
  return response.data;
};

export default api;
