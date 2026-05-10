import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookTicketsSchema } from '@cinema/shared';
import { Modal } from './Modal';
import { useBookTicket } from '@/hooks/useTickets';

export function BookingModal({ session, onClose }) {
  const { mutate: book, isPending, error, isSuccess, data: bookedTickets } = useBookTicket();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookTicketsSchema),
    defaultValues: { sessionId: session.id, quantity: 1 },
  });

  const quantity = Number(watch('quantity')) || 1;
  const total = (Number(session.ticketPrice) * quantity).toFixed(2);
  const maxQty = Math.min(session.availableTickets, 10);

  if (isSuccess) {
    return (
      <Modal title="Booking confirmed" onClose={onClose}>
        <div className="text-center space-y-4 py-4">
          <div className="text-5xl">🎟️</div>
          <p className="text-lg font-semibold">
            {bookedTickets.length} ticket{bookedTickets.length > 1 ? 's' : ''} booked!
          </p>
          <p className="text-sm text-muted-foreground">{session.name}</p>
          <p className="text-xl font-bold">${total} total</p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90"
          >
            Done
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Book tickets" onClose={onClose}>
      <form
        onSubmit={handleSubmit((data) =>
          book({ sessionId: data.sessionId, quantity: Number(data.quantity) })
        )}
        className="space-y-5"
      >
        {/* Session summary */}
        <div className="bg-muted rounded-lg p-4 space-y-1 text-sm">
          <p className="font-medium">{session.name}</p>
          <p className="text-muted-foreground">{session.film?.name}</p>
          <p className="text-muted-foreground">
            {new Date(session.date).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}{' '}
            at{' '}
            {new Date(session.date).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="text-muted-foreground">
            📍 {session.hall?.name}, {session.hall?.city}
          </p>
        </div>

        {/* Quantity */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Number of tickets{' '}
            <span className="text-muted-foreground font-normal">(max {maxQty})</span>
          </label>
          <input
            type="number"
            min={1}
            max={maxQty}
            {...register('quantity', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.quantity && (
            <p className="text-xs text-destructive">{errors.quantity.message}</p>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center py-3 border-t border-border">
          <span className="text-sm text-muted-foreground">
            {quantity} × ${Number(session.ticketPrice).toFixed(2)}
          </span>
          <span className="text-2xl font-bold">${total}</span>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
            {error.error ?? 'Booking failed. Please try again.'}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isPending ? 'Booking…' : 'Confirm booking'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
