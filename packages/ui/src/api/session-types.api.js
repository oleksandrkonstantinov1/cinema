import { apiClient } from './client';

export const getSessionTypes = () => apiClient.get('/session-types');
