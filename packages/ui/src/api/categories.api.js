import { apiClient } from './client';

export const getCategories = () => apiClient.get('/categories');
export const getCountries = () => apiClient.get('/countries');
