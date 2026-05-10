import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { toast } from '@/components/Toaster';

function extractMessage(err) {
  return err?.error ?? err?.message ?? 'Something went wrong';
}

export function useProfile() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => apiClient.get('/users/me'),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiClient.patch('/users/me', data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['users', 'me'], updated);
      toast.success('Profile updated');
    },
    onError: (err) => toast.error(extractMessage(err)),
  });
}
