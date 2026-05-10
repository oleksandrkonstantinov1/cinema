import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSessionSchema, updateSessionSchema } from '@cinema/shared';
import { useFilms } from '@/hooks/useFilms';
import { useSessionTypes } from '@/hooks/useSessions';

function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50';

export function SessionForm({ defaultValues, onSubmit, isPending }) {
  const isEdit = !!defaultValues;
  const schema = isEdit ? updateSessionSchema : createSessionSchema;

  // datetime-local input needs "YYYY-MM-DDTHH:mm" format
  const formDefaults = defaultValues
    ? {
        ...defaultValues,
        date: defaultValues.date
          ? new Date(defaultValues.date).toISOString().slice(0, 16)
          : '',
        ticketPrice: Number(defaultValues.ticketPrice),
      }
    : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: formDefaults });

  const { data: films = [] } = useFilms();
  const { data: sessionTypes = [] } = useSessionTypes();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Session fields */}
      <Field label="Session name" error={errors.name}>
        <input
          type="text"
          placeholder="Evening Screening"
          {...register('name')}
          className={inputCls}
        />
      </Field>

      <Field label="Date & time" error={errors.date}>
        <input type="datetime-local" {...register('date')} className={inputCls} />
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          rows={3}
          placeholder="At least 15 characters…"
          {...register('description')}
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Ticket price ($)" error={errors.ticketPrice}>
          <input
            type="number"
            step="0.01"
            min={0}
            placeholder="12.50"
            {...register('ticketPrice', { valueAsNumber: true })}
            className={inputCls}
          />
        </Field>

        <Field label="Available tickets" error={errors.availableTickets}>
          <input
            type="number"
            min={1}
            placeholder="100"
            {...register('availableTickets', { valueAsNumber: true })}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Film" error={errors.filmId}>
          <select {...register('filmId', { valueAsNumber: true })} className={inputCls}>
            <option value="">Select film…</option>
            {films.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Session type" error={errors.typeId}>
          <select {...register('typeId', { valueAsNumber: true })} className={inputCls}>
            <option value="">Select type…</option>
            {sessionTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Hall fields */}
      <div className="pt-3 border-t border-border space-y-4">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Hall
        </p>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Hall name" error={errors.hall?.name}>
            <input
              type="text"
              placeholder="Hall A"
              {...register('hall.name')}
              className={inputCls}
            />
          </Field>

          <Field label="City" error={errors.hall?.city}>
            <input
              type="text"
              placeholder="Kyiv"
              {...register('hall.city')}
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Address" error={errors.hall?.address}>
          <input
            type="text"
            placeholder="123 Main St"
            {...register('hall.address')}
            className={inputCls}
          />
        </Field>

        <Field label="Hall capacity" error={errors.hall?.capacity}>
          <input
            type="number"
            min={1}
            placeholder="200"
            {...register('hall.capacity', { valueAsNumber: true })}
            className={inputCls}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create session'}
      </button>
    </form>
  );
}
