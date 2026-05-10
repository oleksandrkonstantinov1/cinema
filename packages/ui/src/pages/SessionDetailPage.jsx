import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSession } from '@/hooks/useSessions';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { BookingModal } from '@/components/BookingModal';

function DetailRow({ label, value }) {
  return (
    <div className="flex gap-3 py-3 border-b border-border last:border-0">
      <span className="w-36 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function SkeletonDetail() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-2/3 bg-muted rounded" />
      <div className="h-4 w-1/3 bg-muted rounded" />
      <div className="h-32 bg-muted rounded-xl mt-6" />
    </div>
  );
}

export default function SessionDetailPage() {
  const { id } = useParams();
  const { data: session, isLoading, isError } = useSession(Number(id));
  const { user } = useAuth();
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          ← Back to sessions
        </Link>

        {isLoading && <SkeletonDetail />}

        {isError && (
          <div className="py-16 text-center">
            <p className="text-destructive font-medium">Session not found.</p>
          </div>
        )}

        {session && (
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">{session.name}</h1>
                <span className="shrink-0 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                  {session.type.name}
                </span>
              </div>
              <p className="text-muted-foreground">
                {session.film.name} · {session.film.category.name}
              </p>
            </div>

            {/* Details card */}
            <div className="bg-card border border-border rounded-xl px-5">
              <DetailRow
                label="Date & time"
                value={`${new Date(session.date).toLocaleDateString('en-GB', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })} at ${new Date(session.date).toLocaleTimeString('en-GB', {
                  hour: '2-digit', minute: '2-digit',
                })}`}
              />
              <DetailRow label="Venue" value={`${session.hall.name}, ${session.hall.city}`} />
              <DetailRow label="Address" value={session.hall.address} />
              <DetailRow label="Hall capacity" value={session.hall.capacity} />
              <DetailRow
                label="Available tickets"
                value={
                  session.availableTickets === 0
                    ? 'Sold out'
                    : `${session.availableTickets} remaining`
                }
              />
              <DetailRow
                label="Ticket price"
                value={`$${Number(session.ticketPrice).toFixed(2)}`}
              />
            </div>

            {/* Description */}
            {session.description && (
              <div className="space-y-2">
                <h2 className="font-semibold">About this screening</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {session.description}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="pt-2">
              {!user ? (
                <p className="text-sm text-muted-foreground">
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>{' '}
                  to book tickets.
                </p>
              ) : session.availableTickets === 0 ? (
                <p className="text-sm text-destructive font-medium">This session is sold out.</p>
              ) : (
                <button
                  onClick={() => setShowBooking(true)}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
                >
                  Book tickets — ${Number(session.ticketPrice).toFixed(2)} each
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {showBooking && session && (
        <BookingModal session={session} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}
