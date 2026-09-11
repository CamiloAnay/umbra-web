import { CastShadow } from '../atoms/CastShadow.tsx'
import { assetUrl } from '@/shared/lib/http/assets.ts'

type Props = {
  /** Base name under /img, without extension: the -sm variant is derived. */
  src: string
  alt: string
  width: number
  height: number
  /** Viewport width below which the small file is enough. */
  smallUpTo?: number
  className?: string
  imgClassName?: string
  priority?: boolean
  shadow?: { flatness?: number; opacity?: number } | false
}

/**
 * An image with its shadow on the ground.
 *
 * Two files are published per photograph; the browser picks by viewport so a
 * phone never downloads the 1600px version. Everything below the fold is
 * lazy, and the intrinsic size is always declared so the layout never jumps
 * while the image travels.
 */
export function Figure({
  src,
  alt,
  width,
  height,
  smallUpTo = 768,
  className = '',
  imgClassName = '',
  priority = false,
  shadow = {},
}: Props) {
  return (
    <div className={`relative ${className}`}>
      {shadow !== false && <CastShadow {...shadow} />}
      <picture>
        <source
          media={`(max-width: ${smallUpTo}px)`}
          srcSet={assetUrl(`${src}-sm.webp`)}
          type="image/webp"
        />
        <img
          src={assetUrl(`${src}.webp`)}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          {...(priority ? { fetchPriority: 'high' as const } : {})}
          className={`relative h-full w-full object-cover ${imgClassName}`}
        />
      </picture>
    </div>
  )
}
