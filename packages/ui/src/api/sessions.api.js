import { apiClient } from './client';

export const getSessions = () => apiClient.get('/sessions');
export const getSessionById = (id) => apiClient.get(`/sessions/${id}`);
export const createSession = (data) => apiClient.post('/sessions', data);
export const updateSession = (id, data) => apiClient.put(`/sessions/${id}`, data);
export const deleteSession = (id) => apiClient.delete(`/sessions/${id}`);
