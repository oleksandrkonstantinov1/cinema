import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useProfile() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => apiClient.get('/users/me'),
  });
}
