import { useState } from 'react'
import { buttonClasses } from '@/shared/ui/atoms/buttonStyles.ts'
import { formatIndex, type Amenity } from '../../model/amenity.ts'

type Props = {
  amenities: readonly Amenity[]
  editingId: string | null
  busy: boolean
  onEdit: (amenity: Amenity) => void
  onDelete: (amenity: Amenity) => void
}

/**
 * Presentational. The only state it owns is which row is asking for
 * confirmation, because that is a property of the row on screen and never
 * needs to outlive it.
 */
export function AmenityRows({ amenities, editingId, busy, onEdit, onDelete }: Props) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  return (
    <ul>
      {amenities.map((amenity, index) => {
        const confirming = confirmingId === amenity.id
        const editing = editingId === amenity.id

        return (
          <li
            key={amenity.id}
            className={`flex flex-col gap-3 border-b border-ink/14 py-4 md:flex-row md:items-center
              md:justify-between md:gap-6 ${editing ? 'border-l-2 border-l-blueprint pl-4' : ''}`}
          >
            <div className="min-w-0">
              <p className="flex items-baseline gap-3">
                <span className="cota tabular-nums">{formatIndex(index)}</span>
                <span className="font-display text-[18px] font-semibold w-mid">{amenity.name}</span>
              </p>
              <p className="mt-1 truncate text-[0.9375rem] text-ink/60">{amenity.summary}</p>
            </div>

            {confirming ? (
              <p className="flex flex-none items-center gap-4" role="group">
                <span className="text-[0.9375rem] text-ink/70">¿Eliminar {amenity.name}?</span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    onDelete(amenity)
                    setConfirmingId(null)
                  }}
                  className="cursor-pointer bg-blueprint px-4 py-2 font-display text-[12.5px]
                    font-semibold text-model transition-opacity hover:opacity-90
                    disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Sí, eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingId(null)}
                  className="cursor-pointer font-display text-[12.5px] font-semibold text-ink/60
                    transition-colors hover:text-ink"
                >
                  Cancelar
                </button>
              </p>
            ) : (
              <p className="flex flex-none items-center gap-5">
                <button
                  type="button"
                  onClick={() => onEdit(amenity)}
                  className={buttonClasses('quiet')}
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingId(amenity.id)}
                  className={buttonClasses(
                    'quiet',
                    '!text-ink/55 decoration-ink/25 hover:!text-ink',
                  )}
                >
                  Eliminar
                </button>
              </p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
