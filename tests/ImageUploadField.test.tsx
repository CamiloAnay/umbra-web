import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageUploadField } from '@/features/uploads/ui/ImageUploadField.tsx'
import type { UploadRepository } from '@/features/uploads/api/upload.repository.ts'
import { HttpError } from '@/shared/lib/http/HttpError.ts'

const file = () => new File(['bytes'], 'fachada.jpg', { type: 'image/jpeg' })

const repositoryWith = (upload: UploadRepository['upload']): UploadRepository => ({ upload })

describe('ImageUploadField', () => {
  /**
   * The native input is visually hidden so its intrinsic button cannot overflow
   * a narrow column. That only works if it stays reachable and named, which is
   * exactly what this asserts — hiding it wrongly would break the field for
   * keyboard and screen reader users without changing how it looks.
   */
  it('keeps the hidden input reachable and named', () => {
    render(<ImageUploadField value="" onChange={() => {}} />)

    const input = screen.getByLabelText('Fotografía')

    expect(input).toHaveAttribute('type', 'file')
    expect(input).not.toBeDisabled()
  })

  it('stores the path the server returns', async () => {
    const onChange = vi.fn()
    const upload = vi.fn(async () => ({ path: '/uploads/abc' }))
    render(
      <ImageUploadField value="" onChange={onChange} repository={repositoryWith(upload)} />,
    )

    await userEvent.upload(screen.getByLabelText('Fotografía'), file())

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('/uploads/abc'))
    expect(upload).toHaveBeenCalledOnce()
  })

  it('offers to replace once there is an image, and to select when there is none', () => {
    const { rerender } = render(<ImageUploadField value="" onChange={() => {}} />)
    expect(screen.getByText('Seleccionar imagen')).toBeInTheDocument()

    rerender(<ImageUploadField value="/uploads/abc" onChange={() => {}} />)
    expect(screen.getByText('Reemplazar imagen')).toBeInTheDocument()
  })

  it('shows what the server said when the upload is rejected', async () => {
    const upload = async () => {
      throw new HttpError('validation', 'La imagen supera el tamaño máximo permitido')
    }
    render(<ImageUploadField value="" onChange={() => {}} repository={repositoryWith(upload)} />)

    await userEvent.upload(screen.getByLabelText('Fotografía'), file())

    await waitFor(() =>
      expect(screen.getByText('La imagen supera el tamaño máximo permitido')).toBeInTheDocument(),
    )
    expect(screen.getByLabelText('Fotografía')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not report a path when the upload fails', async () => {
    const onChange = vi.fn()
    const upload = async () => {
      throw new HttpError('server', 'No pudimos subir la imagen')
    }
    render(
      <ImageUploadField value="" onChange={onChange} repository={repositoryWith(upload)} />,
    )

    await userEvent.upload(screen.getByLabelText('Fotografía'), file())

    await waitFor(() => expect(screen.getByText('No pudimos subir la imagen')).toBeInTheDocument())
    expect(onChange).not.toHaveBeenCalled()
  })
})
