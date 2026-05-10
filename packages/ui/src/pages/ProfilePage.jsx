import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateMeSchema } from '@cinema/shared';
import { Navbar } from '@/components/Navbar';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';

function SkeletonField() {
  return <div className="h-5 bg-muted rounded animate-pulse w-48" />;
}

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(updateMeSchema) });

  function onSubmit(data) {
    // strip empty strings — schema fields are optional
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v && v.trim() !== '')
    );
    updateProfile(payload, {
      onSuccess: () => {
        setEditing(false);
        reset();
      },
    });
  }

  function cancelEdit() {
    setEditing(false);
    reset();
  }

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
            {/* Avatar + email */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary select-none">
                {isLoading ? '?' : user.email[0].toUpperCase()}
              </div>
              <div>
                {isLoading
                  ? <SkeletonField />
                  : <p className="font-semibold text-lg leading-tight">{user.email}</p>
                }
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

            {/* Edit toggle */}
            {!isLoading && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-sm text-primary hover:underline"
              >
                Edit profile
              </button>
            )}

            {/* Edit form */}
            {editing && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                <hr className="border-border" />

                <div className="space-y-1">
                  <label className="text-sm font-medium">New email</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder={user?.email}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">New password</label>
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="Min 8 characters"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                {errors.root && (
                  <p className="text-xs text-destructive">{errors.root.message}</p>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isPending ? 'Saving…' : 'Save changes'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 border border-border rounded-lg py-2 text-sm hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
