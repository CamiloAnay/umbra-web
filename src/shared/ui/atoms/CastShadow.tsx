type Props = {
  /** How flat the shadow lies. Lower means a longer, lower sun. */
  flatness?: number
  opacity?: number
  blur?: number
}

/**
 * The shadow an element throws on the ground. It is a sheared copy of the
 * element's own footprint, not a `box-shadow`, so it behaves like a real
 * projection: the same 58 degree sun angle is used by every shadow on the
 * page, which is what makes the light read as one light.
 */
export function CastShadow({ flatness = 0.3, opacity = 0.2, blur = 3 }: Props) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-0 h-full w-full bg-cast"
      style={{
        transform: `skewX(58deg) scaleY(${flatness})`,
        transformOrigin: 'bottom left',
        filter: `blur(${blur}px)`,
        opacity,
      }}
    />
  )
}
