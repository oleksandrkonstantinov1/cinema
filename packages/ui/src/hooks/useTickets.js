import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookTickets, getMyTickets } from '@/api/tickets.api';
import { toast } from '@/components/Toaster';

function extractMessage(err) {
  return err?.error ?? err?.message ?? 'Something went wrong';
}

export function useMyTickets() {
  return useQuery({ queryKey: ['tickets', 'me'], queryFn: getMyTickets });
}

export function useBookTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, quantity }) => bookTickets({ sessionId, quantity }),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['sessions', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'me'] });
      // success toast shown by BookingModal's isSuccess state instead
    },
    onError: (err) => toast.error(extractMessage(err)),
  });
}
