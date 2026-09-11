import { useState } from 'react'
import { AsyncBoundary } from '@/shared/ui/organisms/AsyncBoundary.tsx'
import { Skeleton } from '@/shared/ui/atoms/Skeleton.tsx'
import { useAmenities } from '../../hooks/useAmenities.ts'
import { useAmenityAdmin } from '../../hooks/useAmenityAdmin.ts'
import type { Amenity, AmenityDraft } from '../../model/amenity.ts'
import { AmenityForm } from './AmenityForm.tsx'
import { AmenityRows } from './AmenityRows.tsx'
import { buttonClasses } from '@/shared/ui/atoms/buttonStyles.ts'

type Props = {
  onBack: () => void
}

/**
 * Container for the administration view.
 *
 * It owns the read, the write and which amenity is being edited, and hands the
 * two presentational children plain data. The same repository that feeds the
 * landing feeds this panel, so anything saved here shows up there on the next
 * read — no second source of truth.
 */
export function AdminAmenitiesPage({ onBack }: Props) {
  const { state, retry } = useAmenities()
  const [editing, setEditing] = useState<Amenity | null>(null)

  const { write, errors, save, destroy, reset } = useAmenityAdmin({
    onChanged: () => {
      retry()
      setEditing(null)
    },
  })

  const onSubmit = async (draft: AmenityDraft) => {
    await save(draft, editing)
  }

  const cancelEditing = () => {
    setEditing(null)
    reset()
  }

  return (
    <div className="min-h-dvh bg-lime pb-24">
      <header className="border-b border-ink/14">
        <div className="frame flex items-center justify-between py-5">
          <p className="font-display text-[17px] font-bold w-wide tracking-[0.02em]">
            UMBRAL <span className="font-normal text-ink/45">· administración</span>
          </p>
          <button type="button" onClick={onBack} className={buttonClasses('outline')}>
            Ver la landing
          </button>
        </div>
      </header>

      <main className="frame pt-12">
        <h1 className="text-section">Zonas comunes</h1>
        <p className="mt-4 max-w-[60ch] text-prose text-ink/80">
          Lo que se guarde acá aparece en la landing en la siguiente carga. El identificador se
          deriva del nombre, y el orden se asigna al final de la lista.
        </p>

        {/* One announcement region for every write, read by screen readers. */}
        <p
          role="status"
          aria-live="polite"
          className={`mt-6 min-h-6 text-[1rem] ${
            write.status === 'failed' ? 'text-blueprint' : 'text-ink/70'
          }`}
        >
          {write.status === 'saved' && write.message}
          {write.status === 'failed' && write.message}
        </p>

        <div className="mt-4 grid items-start gap-10 lg:grid-cols-[1fr_minmax(0,26rem)]">
          <section aria-label="Amenidades publicadas">
            <AsyncBoundary
              state={state}
              onRetry={retry}
              emptyMessage="No hay amenidades todavía. Creá la primera con el formulario."
              skeleton={
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Skeleton key={index} className="h-14 w-full" />
                  ))}
                </div>
              }
            >
              {(amenities) => (
                <AmenityRows
                  amenities={amenities}
                  editingId={editing?.id ?? null}
                  busy={write.status === 'saving'}
                  onEdit={setEditing}
                  onDelete={destroy}
                />
              )}
            </AsyncBoundary>
          </section>

          <AmenityForm
            editing={editing}
            errors={errors}
            saving={write.status === 'saving'}
            onSubmit={onSubmit}
            onCancel={cancelEditing}
          />
        </div>
      </main>
    </div>
  )
}
