import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFilmSchema } from '@cinema/shared';
import { useCategories, useCountries } from '@/hooks/useCategories';

const inputCls =
  'w-full px-3 py-2 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50';

export function FilmForm({ onSubmit, isPending }) {
  const { data: categories = [] } = useCategories();
  const { data: countries = [] } = useCountries();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createFilmSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Film name</label>
        <input
          type="text"
          placeholder="Inception"
          {...register('name')}
          className={inputCls}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Release date</label>
        <input type="date" {...register('releaseDate')} className={inputCls} />
        {errors.releaseDate && (
          <p className="text-xs text-destructive">{errors.releaseDate.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Category</label>
          <select {...register('categoryId', { valueAsNumber: true })} className={inputCls}>
            <option value="">Select…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-destructive">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Country</label>
          <select {...register('countryId', { valueAsNumber: true })} className={inputCls}>
            <option value="">Select…</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.countryId && (
            <p className="text-xs text-destructive">{errors.countryId.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {isPending ? 'Adding…' : 'Add film'}
      </button>
    </form>
  );
}
