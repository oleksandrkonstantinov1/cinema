import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          🎬 Cinema
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link to="/my-tickets" className="text-muted-foreground hover:text-foreground transition-colors">
                My Tickets
              </Link>
              <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                Profile
              </Link>
              {isAdmin && (
                <Link to="/admin/sessions" className="text-primary font-medium hover:underline">
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
