import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useAsync } from '@/shared/hooks/useAsync.ts'
import { HttpError } from '@/shared/lib/http/HttpError.ts'

describe('useAsync', () => {
  it('reports the four states of a read', async () => {
    const ready = renderHook(() => useAsync(async () => [1, 2]))
    expect(ready.result.current.state.status).toBe('loading')
    await waitFor(() => expect(ready.result.current.state.status).toBe('ready'))

    const empty = renderHook(() => useAsync(async () => []))
    await waitFor(() => expect(empty.result.current.state.status).toBe('empty'))

    const failed = renderHook(() =>
      useAsync(async () => {
        throw new HttpError('server', 'se cayó')
      }),
    )
    await waitFor(() => expect(failed.result.current.state.status).toBe('error'))
  })

  it('reads again when asked to retry', async () => {
    let calls = 0
    const { result } = renderHook(() =>
      useAsync(async () => {
        calls += 1
        return [calls]
      }),
    )

    await waitFor(() => expect(result.current.state.status).toBe('ready'))
    act(() => result.current.retry())
    await waitFor(() => expect(calls).toBe(2))
  })

  it('ignores a read that resolves after the hook is gone', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { unmount } = renderHook(() =>
      useAsync(() => new Promise((resolve) => setTimeout(() => resolve([1]), 50))),
    )

    unmount()
    await new Promise((resolve) => setTimeout(resolve, 80))

    expect(errors).not.toHaveBeenCalled()
    errors.mockRestore()
  })
})

/**
 * The API is deployed on a plan that suspends it after fifteen minutes without
 * traffic and takes about a minute to wake. Past a few seconds the interface
 * has to say so, or the first visit after a quiet spell reads as a broken page.
 */
describe('useAsync, on a slow read', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not cry wolf while the read is merely in flight', () => {
    const { result } = renderHook(() => useAsync(() => new Promise<number[]>(() => {})))

    expect(result.current.state).toEqual({ status: 'loading', slow: false })

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.state).toEqual({ status: 'loading', slow: false })
  })

  it('admits the wait is long once it is', () => {
    const { result } = renderHook(() => useAsync(() => new Promise<number[]>(() => {})))

    act(() => {
      vi.advanceTimersByTime(4500)
    })

    expect(result.current.state).toEqual({ status: 'loading', slow: true })
  })

  it('starts the wait over on a retry', () => {
    const { result } = renderHook(() => useAsync(() => new Promise<number[]>(() => {})))

    act(() => {
      vi.advanceTimersByTime(4500)
    })
    expect(result.current.state).toEqual({ status: 'loading', slow: true })

    act(() => {
      result.current.retry()
    })
    expect(result.current.state).toEqual({ status: 'loading', slow: false })
  })
})
