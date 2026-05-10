import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Modal } from '@/components/Modal';
import { FilmForm } from '@/components/FilmForm';
import { useFilms, useCreateFilm, useDeleteFilm } from '@/hooks/useFilms';

export default function AdminFilmsPage() {
  const { data: films = [], isLoading } = useFilms();
  const { mutate: createFilm, isPending: isCreating } = useCreateFilm();
  const { mutate: deleteFilm } = useDeleteFilm();

  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // film object

  function handleCreate(data) {
    createFilm(data, { onSuccess: () => setShowAdd(false) });
  }

  function handleDelete(film) {
    setConfirmDelete(film);
  }

  function confirmDeleteFilm() {
    deleteFilm(confirmDelete.id, { onSuccess: () => setConfirmDelete(null) });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Films</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {films.length} film{films.length !== 1 ? 's' : ''} in catalogue
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            + Add film
          </button>
        </div>

        {/* Admin nav tabs */}
        <AdminTabs active="films" />

        {/* Table */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : films.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No films yet. Add one above.</p>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Country</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Released</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {films.map((film) => (
                  <tr key={film.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{film.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{film.category.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{film.country.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(film.releaseDate).getFullYear()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(film)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add film modal */}
      {showAdd && (
        <Modal title="Add film" onClose={() => setShowAdd(false)}>
          <FilmForm onSubmit={handleCreate} isPending={isCreating} />
        </Modal>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <Modal title="Delete film?" onClose={() => setConfirmDelete(null)}>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Delete{' '}
              <span className="font-semibold text-foreground">{confirmDelete.name}</span>?
              This will also remove all associated sessions.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 border border-border rounded-md text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteFilm}
                className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
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
