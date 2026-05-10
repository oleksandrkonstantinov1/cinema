import { apiClient } from './client';

export const bookTickets = (data) => apiClient.post('/tickets', data);
export const getMyTickets = () => apiClient.get('/tickets/me');
