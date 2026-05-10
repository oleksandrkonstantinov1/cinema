import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/Modal';
import { SessionForm } from '@/components/SessionForm';
import {
  useSessions,
  useCreateSession,
  useUpdateSession,
  useDeleteSession,
} from '@/hooks/useSessions';

function AdminTabs({ active }) {
  const tabs = [
    { label: 'Sessions', href: '/admin/sessions' },
    { label: 'Films', href: '/admin/films' },
  ];
  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((t) => (
        <a
          key={t.href}
          href={t.href}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            active === t.label.toLowerCase()
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {t.label}
        </a>
      ))}
    </div>
  );
}

export default function AdminSessionsPage() {
  const { data: sessions = [], isLoading } = useSessions();
  const { mutate: createSession, isPending: isCreating } = useCreateSession();
  const { mutate: updateSession, isPending: isUpdating } = useUpdateSession();
  const { mutate: deleteSession } = useDeleteSession();

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);   // session object for edit modal
  const [confirmDelete, setConfirmDelete] = useState(null); // session object

  function handleCreate(data) {
    createSession(data, { onSuccess: () => setShowCreate(false) });
  }

  function handleUpdate(data) {
    updateSession(
      { id: editTarget.id, data },
      { onSuccess: () => setEditTarget(null) }
    );
  }

  function handleDelete() {
    deleteSession(confirmDelete.id, { onSuccess: () => setConfirmDelete(null) });
  }

  // Build defaultValues from session for edit mode
  function buildDefaults(session) {
    return {
      name: session.name,
      date: session.date,
      description: session.description,
      ticketPrice: Number(session.ticketPrice),
      availableTickets: session.availableTickets,
      filmId: session.filmId,
      typeId: session.typeId,
      hall: {
        name: session.hall.name,
        address: session.hall.address,
        city: session.hall.city,
        capacity: session.hall.capacity,
      },
    };
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sessions</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {sessions.length} session{sessions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            + New session
          </button>
        </div>

        <AdminTabs active="sessions" />

        {/* Table */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No sessions yet. Create one above.
          </p>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Film</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tickets</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{session.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{session.film.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(session.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{session.type.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {session.availableTickets}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setEditTarget(session)}
                          className="text-xs text-primary hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDelete(session)}
                          className="text-xs text-destructive hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Create modal */}
      {showCreate && (
        <Modal title="New session" onClose={() => setShowCreate(false)} size="lg">
          <SessionForm onSubmit={handleCreate} isPending={isCreating} />
        </Modal>
      )}

      {/* Edit modal */}
      {editTarget && (
        <Modal
          title={`Edit — ${editTarget.name}`}
          onClose={() => setEditTarget(null)}
          size="lg"
        >
          <SessionForm
            defaultValues={buildDefaults(editTarget)}
            onSubmit={handleUpdate}
            isPending={isUpdating}
          />
        </Modal>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <Modal title="Delete session?" onClose={() => setConfirmDelete(null)}>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Delete{' '}
              <span className="font-semibold text-foreground">{confirmDelete.name}</span>?
              All booked tickets will also be removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 border border-border rounded-md text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
