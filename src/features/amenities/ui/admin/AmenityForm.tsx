import { useEffect, useState } from 'react'
import { FormField } from '@/shared/ui/molecules/FormField.tsx'
import { ImageUploadField } from '@/features/uploads/ui/ImageUploadField.tsx'
import { buttonClasses } from '@/shared/ui/atoms/buttonStyles.ts'
import {
  emptyAmenityDraft,
  specsFromText,
  specsToText,
  toDraft,
  type Amenity,
  type AmenityDraft,
  type AmenityErrors,
} from '../../model/amenity.ts'

type Props = {
  /** When present, the form edits that amenity instead of creating one. */
  editing: Amenity | null
  errors: AmenityErrors
  saving: boolean
  onSubmit: (draft: AmenityDraft) => void
  onCancel: () => void
}

/**
 * Presentational: it holds the draft being typed and reports it upwards on
 * submit. It does not know whether that draft becomes a POST or a PATCH.
 */
export function AmenityForm({ editing, errors, saving, onSubmit, onCancel }: Props) {
  const [draft, setDraft] = useState<AmenityDraft>(emptyAmenityDraft)

  // Loading a different amenity replaces what is in the form.
  useEffect(() => {
    setDraft(editing ? toDraft(editing) : emptyAmenityDraft)
  }, [editing])

  const set = (field: keyof AmenityDraft, value: string | string[]) =>
    setDraft((current) => ({ ...current, [field]: value }))

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(draft)
      }}
      noValidate
      className="grid gap-6 bg-model p-6 md:grid-cols-2 md:p-8"
    >
      <h2 className="font-display text-[22px] font-semibold w-mid md:col-span-2">
        {editing ? `Editar ${editing.name}` : 'Nueva amenidad'}
      </h2>

      <FormField
        id="amenity-name"
        label="Nombre"
        placeholder="Sala de cine"
        value={draft.name}
        error={errors.name}
        onChange={(event) => set('name', event.target.value)}
      />

      <FormField
        id="amenity-measure"
        label="Medida de la cota"
        placeholder="12 butacas · nivel -1"
        value={draft.measure}
        error={errors.measure}
        onChange={(event) => set('measure', event.target.value)}
      />

      <FormField
        id="amenity-summary"
        label="Descripción corta"
        placeholder="Doce butacas en el semisótano."
        value={draft.summary}
        error={errors.summary}
        onChange={(event) => set('summary', event.target.value)}
        className="md:col-span-2"
      />

      <FormField
        id="amenity-description"
        label="Descripción"
        as="textarea"
        rows={4}
        placeholder="El texto largo que se muestra en el panel de la landing."
        value={draft.description}
        error={errors.description}
        onChange={(event) => set('description', event.target.value)}
        className="md:col-span-2"
      />

      <FormField
        id="amenity-specs"
        label="Fichas técnicas, una por línea"
        as="textarea"
        rows={3}
        placeholder={'12 butacas\nNivel -1\nProyección 4K'}
        value={specsToText(draft.specs)}
        error={errors.specs}
        onChange={(event) => set('specs', specsFromText(event.target.value))}
      />

      <div className="md:col-span-2">
        <ImageUploadField
          label="Fotografía"
          value={draft.image}
          error={errors.image}
          onChange={(path) => set('image', path)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 md:col-span-2">
        <button type="submit" disabled={saving} className={buttonClasses('solid')}>
          {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear amenidad'}
        </button>

        {editing && (
          <button type="button" onClick={onCancel} className={buttonClasses('quiet')}>
            Cancelar la edición
          </button>
        )}
      </div>
    </form>
  )
}
