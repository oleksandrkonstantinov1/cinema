import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useMyTickets } from '@/hooks/useTickets';

const STATUS_STYLES = {
  BOOKED:    'bg-blue-100 text-blue-700',
  PAID:      'bg-green-100 text-green-700',
  CANCELLED: 'bg-muted text-muted-foreground line-through',
};

function TicketCard({ ticket }) {
  const { session, status, purchaseDate } = ticket;
  const sessionDate = new Date(session.date);

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            to={`/sessions/${session.id}`}
            className="font-semibold hover:text-primary transition-colors"
          >
            {session.name}
          </Link>
          <p className="text-sm text-muted-foreground mt-0.5">{session.film?.name}</p>
        </div>
        <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[status]}`}>
          {status}
        </span>
      </div>

      {/* Details */}
      <div className="text-sm text-muted-foreground space-y-1">
        <div className="flex items-center gap-1.5">
          <span>📅</span>
          <span>
            {sessionDate.toLocaleDateString('en-GB', {
              weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
            })}{' '}
            at{' '}
            {sessionDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        {session.hall && (
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span>{session.hall.name}, {session.hall.city}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span>🎟️</span>
          <span>
            Booked {new Date(purchaseDate).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return <div className="h-36 bg-muted rounded-xl animate-pulse" />;
}

export default function MyTicketsPage() {
  const { data: tickets, isLoading, isError } = useMyTickets();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Tickets</h1>
          {!isLoading && !isError && (
            <p className="text-sm text-muted-foreground mt-1">
              {tickets?.length ?? 0} ticket{tickets?.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {isError && (
          <p className="text-destructive py-8 text-center">Failed to load tickets.</p>
        )}

        {!isLoading && !isError && tickets?.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <p className="text-5xl">🎟️</p>
            <p className="text-muted-foreground">No tickets yet.</p>
            <Link to="/" className="text-sm text-primary hover:underline">
              Browse sessions
            </Link>
          </div>
        )}

        {!isLoading && !isError && tickets?.length > 0 && (
          <div className="space-y-4">
            {tickets.map((t) => <TicketCard key={t.id} ticket={t} />)}
          </div>
        )}
      </main>
    </div>
  );
}
