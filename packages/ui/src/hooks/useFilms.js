import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFilms, createFilm, deleteFilm } from '@/api/films.api';
import { toast } from '@/components/Toaster';

function extractMessage(err) {
  return err?.error ?? err?.message ?? 'Something went wrong';
}

export function useFilms() {
  return useQuery({ queryKey: ['films'], queryFn: getFilms });
}

export function useCreateFilm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFilm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['films'] });
      toast.success('Film added');
    },
    onError: (err) => toast.error(extractMessage(err)),
  });
}

export function useDeleteFilm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFilm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['films'] });
      toast.success('Film deleted');
    },
    onError: (err) => toast.error(extractMessage(err)),
  });
}
