import { useState } from 'react';
import { useSessions } from '@/hooks/useSessions';
import { SessionCard } from '@/components/SessionCard';
import { Navbar } from '@/components/Navbar';

function SessionsGrid({ sessions }) {
  if (sessions.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground text-lg">No upcoming sessions scheduled.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}

export default function SessionsPage() {
  const { data: sessions, isLoading, isError } = useSessions();
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? (sessions ?? []).filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.film.name.toLowerCase().includes(search.toLowerCase())
      )
    : (sessions ?? []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 space-y-6">
        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Upcoming Screenings</h1>
            {!isLoading && !isError && (
              <p className="text-muted-foreground mt-1">
                {sessions?.length ?? 0} session{sessions?.length !== 1 ? 's' : ''} available
              </p>
            )}
          </div>

          {/* Search */}
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or film…"
            className="w-full sm:w-72 px-3 py-2 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Content */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-56 bg-muted rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="py-16 text-center">
            <p className="text-destructive font-medium">Failed to load sessions.</p>
            <p className="text-sm text-muted-foreground mt-1">Check your connection and try again.</p>
          </div>
        )}

        {!isLoading && !isError && <SessionsGrid sessions={filtered} />}
      </main>
    </div>
  );
}
