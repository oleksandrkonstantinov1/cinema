import { Navbar } from '@/components/Navbar';
import { useProfile } from '@/hooks/useProfile';

function SkeletonField() {
  return <div className="h-5 bg-muted rounded animate-pulse w-48" />;
}

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useProfile();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 max-w-lg space-y-6">
        <h1 className="text-2xl font-bold">My Profile</h1>

        {isError && (
          <p className="text-destructive py-8 text-center">Failed to load profile.</p>
        )}

        {!isError && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            {/* Avatar placeholder */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary select-none">
                {isLoading ? '?' : user.email[0].toUpperCase()}
              </div>
              <div className="space-y-1">
                {isLoading ? <SkeletonField /> : (
                  <p className="font-semibold text-lg leading-tight">{user.email}</p>
                )}
                {isLoading ? <div className="h-4 bg-muted rounded animate-pulse w-16" /> : (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    user.role === 'ADMIN'
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                )}
              </div>
            </div>

            <hr className="border-border" />

            {/* Details */}
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium text-right">
                  {isLoading ? <SkeletonField /> : user.email}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="font-medium">
                  {isLoading ? <SkeletonField /> : user.role}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Member since</dt>
                <dd className="font-medium">
                  {isLoading ? <SkeletonField /> : (
                    new Date(user.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })
                  )}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </main>
    </div>
  );
}
