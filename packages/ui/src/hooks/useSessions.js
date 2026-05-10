import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
} from '@/api/sessions.api';
import { getSessionTypes } from '@/api/session-types.api';
import { toast } from '@/components/Toaster';

function extractMessage(err) {
  return err?.error ?? err?.message ?? 'Something went wrong';
}

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
    staleTime: 60_000,
  });
}

export function useSession(id) {
  return useQuery({
    queryKey: ['sessions', id],
    queryFn: () => getSessionById(id),
    enabled: !!id,
  });
}

export function useSessionTypes() {
  return useQuery({
    queryKey: ['session-types'],
    queryFn: getSessionTypes,
    staleTime: Infinity,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Session created');
    },
    onError: (err) => toast.error(extractMessage(err)),
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateSession(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', id] });
      toast.success('Session updated');
    },
    onError: (err) => toast.error(extractMessage(err)),
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Session deleted');
    },
    onError: (err) => toast.error(extractMessage(err)),
  });
}
