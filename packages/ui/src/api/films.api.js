import { apiClient } from './client';

export const getFilms = () => apiClient.get('/films');
export const createFilm = (data) => apiClient.post('/films', data);
export const deleteFilm = (id) => apiClient.delete(`/films/${id}`);
