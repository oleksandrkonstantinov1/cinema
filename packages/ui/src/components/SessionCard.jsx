import { Link } from 'react-router-dom';

const TYPE_BADGE = {
  IMAX: 'bg-blue-100 text-blue-700',
  '3D': 'bg-purple-100 text-purple-700',
  VIP: 'bg-amber-100 text-amber-700',
  Standard: 'bg-secondary text-secondary-foreground',
};

export function SessionCard({ session }) {
  const { id, name, date, film, hall, type, ticketPrice, availableTickets } = session;

  const d = new Date(date);
  const dateStr = d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const soldOut = availableTickets === 0;
  const badgeClass = TYPE_BADGE[type.name] ?? TYPE_BADGE.Standard;

  return (
    <Link to={`/sessions/${id}`} className="group block">
      <article className="h-full bg-card border border-border rounded-xl p-5 space-y-4 hover:shadow-md hover:border-primary/40 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h2>
          <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>
            {type.name}
          </span>
        </div>

        {/* Film info */}
        <div className="space-y-0.5">
          <p className="text-sm font-medium">{film.name}</p>
          <p className="text-xs text-muted-foreground">
            {film.category.name}
            {film.country?.name ? ` · ${film.country.name}` : ''}
          </p>
        </div>

        {/* Date / location */}
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-1.5">
            <span>📅</span>
            <span>
              {dateStr} at {timeStr}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span>
              {hall.name}, {hall.city}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <span className="text-lg font-bold">${Number(ticketPrice).toFixed(2)}</span>
          {soldOut ? (
            <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full">
              Sold out
            </span>
          ) : (
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
              {availableTickets} left
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
